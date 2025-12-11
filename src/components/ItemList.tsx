import React, { useMemo } from 'react';
import { useShopping } from '../context/ShoppingContext';
import type { ShoppingItem } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/categories';
import { formatCurrency } from '../utils/format';
import { Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const ItemList = () => {
    const { items, toggleItem, removeItem } = useShopping();

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (a.checked === b.checked) return b.createdAt - a.createdAt;
            return a.checked ? 1 : -1;
        });
    }, [items]);

    if (items.length === 0) {
        return (
            <div className="text-center py-10 text-slate-400">
                <p>Sua lista está vazia.</p>
                <p className="text-sm">Adicione itens para começar!</p>
            </div>
        )
    }

    return (
        <div className="space-y-3 pb-32">
            <AnimatePresence mode='popLayout'>
                {sortedItems.map((item) => (
                    <ItemCard key={item.id} item={item} onToggle={() => toggleItem(item.id)} onRemove={() => removeItem(item.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const ItemCard = ({ item, onToggle, onRemove }: { item: ShoppingItem, onToggle: () => void, onRemove: () => void }) => {
    // Swipe logic
    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x < -100) {
            onRemove();
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ touchAction: "none" }}
            className="relative"
        >
            {/* Background delete layer */}
            <div className="absolute inset-0 bg-rose-500 rounded-xl flex items-center justify-end px-4 text-white">
                <Trash2 size={24} />
            </div>

            {/* Foreground content card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.02 }}
                className={clsx(
                    "relative bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-all cursor-grab active:cursor-grabbing",
                    item.checked && "opacity-60 bg-slate-50 dark:bg-slate-900/50 grayscale-[0.5]"
                )}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={onToggle}
                        className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                            item.checked ? "bg-green-500 border-green-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-primary"
                        )}
                    >
                        {item.checked && <Check size={14} strokeWidth={3} />}
                    </button>
                </div>

                <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
                    CATEGORY_COLORS[item.category]
                )}>
                    {React.createElement(CATEGORY_ICONS[item.category], { size: 18 })}
                </div>

                <div className="flex-1 min-w-0 pointer-events-none select-none">
                    <h3 className={clsx("font-medium truncate text-slate-800 dark:text-slate-100", item.checked && "line-through text-slate-500")}>
                        {item.name}
                    </h3>
                    <div className="text-sm text-slate-500 flex gap-2">
                        <span>{item.qty}x</span>
                        {item.price > 0 && <span>{formatCurrency(item.price)}</span>}
                    </div>
                </div>

                <div className="text-right pointer-events-none select-none">
                    <div className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                        {formatCurrency(item.price * item.qty)}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
