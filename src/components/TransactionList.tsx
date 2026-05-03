import { Transaction } from '../types';
import { Pencil, Trash2, Receipt, Calendar, User as UserIcon, Tag, CreditCard, Notebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn, formatCurrencyLAK, formatCurrencyTHB } from '../lib/utils';
import { removeTransaction } from '../lib/firebase';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
}

export default function TransactionList({ transactions, onEdit }: Props) {
  const handleDelete = async (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການນີ້?')) {
      try {
        await removeTransaction(id);
      } catch (err) {
        alert('ເກີດຂໍ້ຜິດພາດໃນການລຶບຂໍ້ມູນ');
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-[#141414]/10 rounded-3xl">
        <Receipt size={48} className="mx-auto mb-4 opacity-10" />
        <p className="text-gray-400 font-medium">ຍັງບໍ່ມີຂໍ້ມູນການເຄື່ອນໄຫວ</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div className="min-w-[1000px] inline-block w-full align-middle">
        <div className="border border-[#141414] rounded-xl overflow-hidden shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141414] text-white text-[10px] font-mono tracking-[0.2em] uppercase text-center">
                <th className="p-4 border-r border-white/10" rowSpan={2}>ວັນທີ</th>
                <th className="p-4 border-r border-white/10 italic serif capitalize tracking-wider font-normal" rowSpan={2}>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="p-3 border-b border-r border-white/10 italic serif capitalize tracking-wider font-bold text-emerald-400 bg-emerald-500/10">ລາຍຮັບ (Income)</th>
                <th className="p-3 border-b border-r border-white/10 italic serif capitalize tracking-wider font-bold text-rose-400 bg-rose-500/10">ລາຍຈ່າຍ (Expense)</th>
                <th className="p-4 italic serif capitalize tracking-wider font-normal w-32" rowSpan={2}>ຈັດການ</th>
              </tr>
              <tr className="bg-[#141414] text-white text-[9px] font-mono tracking-[0.1em] uppercase text-center">
                <th className="p-2 border-r border-white/10 text-emerald-300">LAK / THB</th>
                <th className="p-2 border-r border-white/10 text-rose-300">LAK / THB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]/10">
              <AnimatePresence>
                {transactions.map((t) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                    className="hover:bg-blue-50 transition-colors group"
                  >
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar size={14} className="opacity-40" />
                        <span className="font-mono text-sm font-bold">{format(new Date(t.date), 'dd/MM/yyyy')}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#141414]/5 rounded-full flex items-center justify-center shrink-0">
                          <UserIcon size={14} className="opacity-40" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight text-[#141414] uppercase">{t.fullName || '-'}</span>
                          {t.note && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Notebook size={10} className="text-gray-400 shrink-0" />
                              <span className="text-[10px] font-medium text-gray-400 italic serif truncate max-w-[200px]">
                                {t.note}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 bg-emerald-50/40 border-r border-[#141414]/5 group-hover:bg-emerald-50/60 transition-colors">
                      <div className="space-y-2 text-center">
                        {t.incomeLAK > 0 && <p className="text-sm font-black text-emerald-700 tracking-tight">+{formatCurrencyLAK(t.incomeLAK)}</p>}
                        {t.incomeTHB > 0 && <p className="text-sm font-black text-emerald-700 tracking-tight">+{formatCurrencyTHB(t.incomeTHB)}</p>}
                        {t.incomeLAK === 0 && t.incomeTHB === 0 && <span className="text-xs opacity-20">-</span>}
                      </div>
                    </td>
                    <td className="p-4 bg-rose-50/40 border-r border-[#141414]/5 group-hover:bg-rose-50/60 transition-colors">
                      <div className="space-y-2 text-center">
                        {(t.expenseLAK > 0 || t.detailsLAK) && (
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-rose-700 tracking-tight">-{formatCurrencyLAK(t.expenseLAK)}</p>
                            {t.detailsLAK && <p className="text-[10px] opacity-50 font-serif italic font-medium leading-tight">{t.detailsLAK}</p>}
                          </div>
                        )}
                        {(t.expenseTHB > 0 || t.detailsTHB) && (
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-rose-700 tracking-tight">-{formatCurrencyTHB(t.expenseTHB)}</p>
                            {t.detailsTHB && <p className="text-[10px] opacity-50 font-serif italic font-medium leading-tight">{t.detailsTHB}</p>}
                          </div>
                        )}
                        {t.expenseLAK === 0 && t.expenseTHB === 0 && <span className="text-xs opacity-20">-</span>}
                      </div>
                    </td>
                    <td 
                      className="p-4 cursor-pointer"
                      onClick={() => onEdit(t)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 ml-auto">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(t);
                            }}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg transition-all hover:bg-emerald-600 hover:text-white border border-emerald-100 shadow-sm"
                            title="ແກ້ໄຂ"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              t.id && handleDelete(t.id);
                            }}
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg transition-all hover:bg-rose-600 hover:text-white border border-rose-100 shadow-sm"
                            title="ລຶບ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          <div className="bg-[#141414]/5 p-4 flex items-center justify-between text-[10px] font-mono opacity-50 uppercase tracking-widest">
            <span>Total Records: {transactions.length}</span>
            <span>END OF DATASET</span>
          </div>
        </div>
      </div>
    </div>
  );
}
