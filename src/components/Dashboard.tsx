import { Summary } from '../types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon, Landmark } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrencyLAK, formatCurrencyTHB, cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  summary: Summary;
}

export default function Dashboard({ summary }: Props) {
  const lakData = [
    { name: 'ລາຍຮັບ (LAK)', value: summary.totalIncomeLAK, color: '#10b981' },
    { name: 'ລາຍຈ່າຍ (LAK)', value: summary.totalExpenseLAK, color: '#f43f5e' },
  ].filter(d => d.value > 0);

  const thbData = [
    { name: 'ລາຍຮັບ (THB)', value: summary.totalIncomeTHB, color: '#10b981' },
    { name: 'ລາຍຈ່າຍ (THB)', value: summary.totalExpenseTHB, color: '#f43f5e' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-12">
      {/* Balances Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#141414] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <Wallet size={16} />
              </div>
              <span className="text-[10px] font-mono tracking-widest opacity-50 uppercase">NET LAK BALANCE</span>
            </div>
            <div>
              <h3 className="text-5xl font-black tracking-tighter">{formatCurrencyLAK(summary.balanceLAK)}</h3>
              <p className="text-[10px] font-mono opacity-40 mt-2">ຄົງເຫຼືອທັງໝົດ (ເງິນກີບ)</p>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-[#141414] text-[#141414] p-8 rounded-[2rem] shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#141414]/5 rounded-full flex items-center justify-center">
                <Landmark size={16} />
              </div>
              <span className="text-[10px] font-mono tracking-widest opacity-40 uppercase">NET THB BALANCE</span>
            </div>
            <div>
              <h3 className="text-5xl font-black tracking-tighter">{formatCurrencyTHB(summary.balanceTHB)}</h3>
              <p className="text-[10px] font-mono opacity-40 mt-2">ຄົງເຫຼືອທັງໝົດ (ເງິນບາດ)</p>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#141414]/5 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Grouped Income vs Expense Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Income Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-600">ລາຍຮັບ (Total Income)</h3>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 grid grid-cols-2 gap-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-emerald-700/60 uppercase">LAK (ກີບ)</span>
              <p className="text-xl font-bold tracking-tight text-emerald-700">{formatCurrencyLAK(summary.totalIncomeLAK)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-emerald-700/60 uppercase">THB (ບາດ)</span>
              <p className="text-xl font-bold tracking-tight text-emerald-700">{formatCurrencyTHB(summary.totalIncomeTHB)}</p>
            </div>
          </div>
        </div>

        {/* Expense Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-rose-600">ລາຍຈ່າຍ (Total Expense)</h3>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 grid grid-cols-2 gap-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-rose-700/60 uppercase">LAK (ກີບ)</span>
              <p className="text-xl font-bold tracking-tight text-rose-700">{formatCurrencyLAK(summary.totalExpenseLAK)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-rose-700/60 uppercase">THB (ບາດ)</span>
              <p className="text-xl font-bold tracking-tight text-rose-700">{formatCurrencyTHB(summary.totalExpenseTHB)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* LAK Chart */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-[#141414]/10 p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <PieChartIcon size={18} className="opacity-50" />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">LAK Proportion</h3>
            </div>
          </div>
          <div className="h-[240px] w-full">
            {lakData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lakData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {lakData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '2px solid #141414',
                      boxShadow: '8px 8px 0px 0px rgba(20,20,20,0.05)',
                      fontFamily: 'inherit',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: '"JetBrains Mono", monospace' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-[#141414]/5 rounded-2xl">
                <PieChartIcon size={32} className="mb-2 opacity-20" />
                <p className="text-[10px] font-mono uppercase">LAK Dataset Empty</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* THB Chart */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#141414]/10 p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <PieChartIcon size={18} className="opacity-50" />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">THB Proportion</h3>
            </div>
          </div>
          <div className="h-[240px] w-full">
            {thbData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={thbData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {thbData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '2px solid #141414',
                      boxShadow: '8px 8px 0px 0px rgba(20,20,20,0.05)',
                      fontFamily: 'inherit',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: '"JetBrains Mono", monospace' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-[#141414]/5 rounded-2xl">
                <PieChartIcon size={32} className="mb-2 opacity-20" />
                <p className="text-[10px] font-mono uppercase">THB Dataset Empty</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
