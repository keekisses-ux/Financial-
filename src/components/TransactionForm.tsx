import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction } from '../types';
import { addTransaction, updateTransaction } from '../lib/firebase';
import { cn } from '../lib/utils';

interface Props {
  user: User;
  onClose: () => void;
  initialData?: Transaction | null;
}

export default function TransactionForm({ user, onClose, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    fullName: '',
    incomeLAK: 0,
    incomeTHB: 0,
    expenseLAK: 0,
    expenseTHB: 0,
    detailsLAK: '',
    detailsTHB: '',
    note: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date.split('T')[0],
        fullName: initialData.fullName,
        incomeLAK: initialData.incomeLAK,
        incomeTHB: initialData.incomeTHB,
        expenseLAK: initialData.expenseLAK,
        expenseTHB: initialData.expenseTHB,
        detailsLAK: initialData.detailsLAK,
        detailsTHB: initialData.detailsTHB,
        note: initialData.note,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        ...formData,
        userId: user.uid,
        incomeLAK: Number(formData.incomeLAK),
        incomeTHB: Number(formData.incomeTHB),
        expenseLAK: Number(formData.expenseLAK),
        expenseTHB: Number(formData.expenseTHB),
      };

      if (initialData?.id) {
        await updateTransaction(initialData.id, data);
      } else {
        await addTransaction(data);
      }
      onClose();
    } catch (err: any) {
      setError("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#141414]/10"
      >
        <div className="bg-[#141414] text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight uppercase">
              {initialData ? 'ແກ້ໄຂລາຍການ' : 'ເພີ່ມລາຍການໃໝ່'}
            </h2>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mt-1">Transaction Ledger Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Info */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">ວັນທີ (Date)</label>
              <input 
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-blue-50/50 border border-[#141414]/10 rounded-lg p-3 font-mono focus:ring-2 focus:ring-[#141414] outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">ຊື່ແລະນາມສະກຸນ (Full Name)</label>
              <input 
                type="text"
                name="fullName"
                placeholder="ຊື່ ແລະ ນາມສະກຸນ..."
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-blue-50/50 border border-[#141414]/10 rounded-lg p-3 focus:ring-2 focus:ring-[#141414] outline-none transition-all"
              />
            </div>

            {/* Income Section */}
            <div className="p-4 bg-emerald-50 rounded-xl space-y-4 border border-emerald-100">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest italic serif">ລາຍຮັບ (Income)</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">LAK (ກີບ)</span>
                  <input 
                    type="number"
                    name="incomeLAK"
                    value={formData.incomeLAK}
                    onChange={handleChange}
                    className="w-full bg-white border border-emerald-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">THB (ບາດ)</span>
                  <input 
                    type="number"
                    name="incomeTHB"
                    value={formData.incomeTHB}
                    onChange={handleChange}
                    className="w-full bg-white border border-emerald-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Expense Section */}
            <div className="p-4 bg-rose-50 rounded-xl space-y-4 border border-rose-100">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-widest italic serif">ລາຍຈ່າຍ (Expense)</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-rose-600 font-bold">LAK (ກີບ)</span>
                  <input 
                    type="number"
                    name="expenseLAK"
                    value={formData.expenseLAK}
                    onChange={handleChange}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-rose-600 font-bold">THB (ບາດ)</span>
                  <input 
                    type="number"
                    name="expenseTHB"
                    value={formData.expenseTHB}
                    onChange={handleChange}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Detail Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">ລາຍລະອຽດກີບ (Details LAK)</label>
              <textarea 
                name="detailsLAK"
                rows={2}
                value={formData.detailsLAK}
                onChange={handleChange}
                className="w-full bg-blue-50/50 border border-[#141414]/10 rounded-lg p-3 focus:ring-2 focus:ring-[#141414] outline-none transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">ລາຍລະອຽດບາດ (Details THB)</label>
              <textarea 
                name="detailsTHB"
                rows={2}
                value={formData.detailsTHB}
                onChange={handleChange}
                className="w-full bg-blue-50/50 border border-[#141414]/10 rounded-lg p-3 focus:ring-2 focus:ring-[#141414] outline-none transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">ໝາຍເຫດ (Note)</label>
              <textarea 
                name="note"
                rows={2}
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-blue-50/50 border border-[#141414]/10 rounded-lg p-3 focus:ring-2 focus:ring-[#141414] outline-none transition-all resize-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#141414] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                ບັນທຶກຂໍ້ມູນ
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
