import { useState, useEffect, useMemo } from 'react';
import { 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { auth, transactionsCollection, handleFirestoreError, OperationType, loginWithGoogle, logout } from './lib/firebase';
import { Transaction, Summary } from './types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Wallet, LogOut, Plus, Search, ChevronDown, ListFilter, TrendingUp, TrendingDown, Landmark, Receipt, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn, formatCurrencyLAK, formatCurrencyTHB } from './lib/utils';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    const q = query(
      transactionsCollection,
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(docs);
      setDataLoading(false);
    }, (error) => {
      setDataLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    });

    return () => unsubscribe();
  }, [user]);

  const summary: Summary = useMemo(() => {
    const s = transactions.reduce((acc, t) => {
      acc.totalIncomeLAK += t.incomeLAK || 0;
      acc.totalIncomeTHB += t.incomeTHB || 0;
      acc.totalExpenseLAK += t.expenseLAK || 0;
      acc.totalExpenseTHB += t.expenseTHB || 0;
      return acc;
    }, {
      totalIncomeLAK: 0,
      totalIncomeTHB: 0,
      totalExpenseLAK: 0,
      totalExpenseTHB: 0,
      balanceLAK: 0,
      balanceTHB: 0
    });

    s.balanceLAK = s.totalIncomeLAK - s.totalExpenseLAK;
    s.balanceTHB = s.totalIncomeTHB - s.totalExpenseTHB;
    return s;
  }, [transactions]);

  if (authLoading || (user && dataLoading && transactions.length === 0)) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#141414] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#141414] font-medium tracking-tight">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center font-sans p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center flex flex-col items-center gap-8 border border-[#141414]/10"
        >
          <div className="w-20 h-20 bg-[#141414] rounded-full flex items-center justify-center text-white shadow-lg">
            <Landmark size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[#141414] tracking-tight">ຕິດຕາມບັນຊີ</h1>
            <p className="text-gray-500 font-medium">ລະບົບຕິດຕາມລາຍຮັບ-ລາຍຈ່າຍ ສ່ວນຕົວ</p>
          </div>
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-[#141414] text-white py-4 px-6 rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-md"
          >
            ເຂົ້າສູ່ລະບົບດ້ວຍ Google
          </button>
        </motion.div>
      </div>
    );
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#141414] font-sans selection:bg-[#141414] selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#F0F7FF]/80 backdrop-blur-md border-bottom border-[#141414]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between border-b border-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141414] rounded-lg flex items-center justify-center text-white">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tighter uppercase">ACCOUNTING</h1>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest leading-none mt-1">LAK • THB TRACKER</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold">{user.displayName}</span>
              <span className="text-[10px] opacity-50 font-mono">{user.email}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-[#141414] hover:text-white rounded-lg transition-colors border border-[#141414]/10"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Summary Dashboard */}
        <Dashboard summary={summary} />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-[#141414] pb-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
              <ListFilter size={16} />
              Recent Transactions
            </h2>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#141414] text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-all active:scale-95 shadow-lg"
          >
            <Plus size={20} />
            ເພີ່ມລາຍການໃໝ່
          </button>
        </div>

        {/* Data List */}
        <TransactionList 
          transactions={transactions} 
          onEdit={handleEdit}
        />
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm 
            user={user} 
            onClose={handleCloseForm} 
            initialData={editingTransaction}
          />
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-[#141414]/10 text-center">
        <p className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Accounting System &bull; LAK THB Ledger
        </p>
      </footer>
    </div>
  );
}
