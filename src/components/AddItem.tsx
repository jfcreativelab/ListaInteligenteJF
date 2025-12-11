import React, { useState } from 'react';
import { toast } from 'sonner';
import { useShopping } from '../context/ShoppingContext';
import type { Category } from '../types';
import { Plus, ChevronDown, Mic, MicOff } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../utils/categories';
import { categorizeItem } from '../utils/autocategorize';
import { useVoiceInput } from '../hooks/useVoiceInput';
import clsx from 'clsx';

export const AddItem = () => {
    const { addItem } = useShopping();
    const [name, setName] = useState('');
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<Category>('outros');
    const [showCats, setShowCats] = useState(false);

    const { isListening, startListening } = useVoiceInput((text) => {
        // Smart parse: "2 leites" -> qty 2, name "leites"
        // Regex to find leading number
        const match = text.match(/^(\d+)\s+(.+)/);
        if (match) {
            const num = parseInt(match[1]);
            const rest = match[2];
            setQty(num);
            setName(rest);

            if (rest.length > 2) {
                const autoCat = categorizeItem(rest);
                if (autoCat !== 'outros') setCategory(autoCat);
            }
        } else {
            setName(text);
            if (text.length > 2) {
                const autoCat = categorizeItem(text);
                if (autoCat !== 'outros') setCategory(autoCat);
            }
        }
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (val.length > 2) {
            const autoCat = categorizeItem(val);
            if (autoCat !== 'outros') setCategory(autoCat);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error("Digite o nome do produto!");
            return;
        }

        addItem({
            name,
            qty: Number(qty),
            price: price ? Number(price.replace(',', '.')) : 0,
            category
        });

        toast.success(`${name} adicionado!`);

        setName('');
        setQty(1);
        setPrice('');
        setCategory('outros');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 relative overflow-visible transition-all duration-300">

            {isListening && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse z-20" />
            )}

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder={isListening ? "Ouvindo..." : "O que vamos comprar?"}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-4 pr-12 py-3.5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-white shadow-inner"
                        value={name}
                        onChange={handleNameChange}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={startListening}
                        className={clsx(
                            "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
                            isListening ? "bg-red-100 text-red-500 animate-pulse" : "text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700"
                        )}
                        title="Usar Voz"
                    >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[80px_1fr_auto] gap-3">
                <input
                    type="number"
                    placeholder="1"
                    className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-2 py-3.5 focus:ring-2 focus:ring-primary outline-none text-center text-slate-800 dark:text-white shadow-inner font-medium"
                    value={qty || ''}
                    onChange={(e) => setQty(Number(e.target.value))}
                    min={1}
                />

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                    <input
                        type="text"
                        placeholder="0,00"
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-3.5 focus:ring-2 focus:ring-primary outline-none text-slate-800 dark:text-white shadow-inner"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        inputMode="decimal"
                    />
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowCats(!showCats)}
                        className="h-full px-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        title="Selecionar Categoria"
                    >
                        {React.createElement(CATEGORY_ICONS[category], { size: 20, className: "text-slate-600 dark:text-slate-300" })}
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    {/* Category Dropdown */}
                    {showCats && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 z-50 grid grid-cols-2 gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                            {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => { setCategory(cat); setShowCats(false); }}
                                    className={clsx(
                                        "flex items-center gap-2 p-2.5 rounded-lg text-sm transition-colors w-full text-left",
                                        category === cat ? "bg-primary/10 text-primary font-medium" : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    )}
                                >
                                    {React.createElement(CATEGORY_ICONS[cat], { size: 16 })}
                                    <span className="truncate">{CATEGORY_LABELS[cat]}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-lg">
                <Plus size={22} />
            </button>
        </form>
    );
};
