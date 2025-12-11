import { useMemo } from 'react';
import { useShopping } from '../context/ShoppingContext';
import { CATEGORY_HEX, CATEGORY_LABELS } from '../utils/categories';
import type { Category } from '../types';
import { X } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../utils/format';
import { motion } from 'framer-motion';

export const Dashboard = ({ onClose }: { onClose: () => void }) => {
    const { items, total } = useShopping();

    const data = useMemo(() => {
        const catMap: Record<string, number> = {};
        items.forEach(item => {
            const subtotal = item.qty * item.price;
            catMap[item.category] = (catMap[item.category] || 0) + subtotal;
        });

        return Object.entries(catMap)
            .map(([cat, value]) => ({
                name: CATEGORY_LABELS[cat as Category],
                value,
                color: CATEGORY_HEX[cat as Category] || '#94a3b8'
            }))
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [items]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Gastos por Categoria</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {data.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">Sem dados para exibir.</div>
                    ) : (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#333' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        {data.map(d => (
                            <div key={d.name} className="flex justify-between items-center text-sm text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span>{d.name}</span>
                                </div>
                                <span className="font-bold">{formatCurrency(d.value)}</span>
                            </div>
                        ))}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                            <span>Total</span>
                            <span className="text-primary">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
