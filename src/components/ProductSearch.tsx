import { useState } from 'react';
import { Search, X, ShoppingCart, ExternalLink } from 'lucide-react';
import { MOCK_PRODUCTS } from '../utils/productDb';
import { useShopping } from '../context/ShoppingContext';
import { toast } from 'sonner';
import type { Category } from '../types';

interface ProductSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProductSearch = ({ isOpen, onClose }: ProductSearchProps) => {
    const { addItem } = useShopping();
    const [query, setQuery] = useState('');

    if (!isOpen) return null;

    const filtered = query.length > 1
        ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleAdd = (product: typeof MOCK_PRODUCTS[0]) => {
        addItem({
            name: product.name,
            price: product.price,
            qty: 1,
            category: product.category as Category
        });
        toast.success(`${product.name} adicionado!`);
        onClose();
        setQuery('');
    };

    const handleWebSearch = () => {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-slate-100 dark:border-slate-800 animate-scale-up">

                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-3 items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <Search className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar produto (ex: Arroz, Heineken...)"
                        className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {query.length > 1 && filtered.length === 0 && (
                        <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-3">
                            <p>Nenhum produto encontrado no catálogo local.</p>
                            <button
                                onClick={handleWebSearch}
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                <ExternalLink size={16} />
                                Pesquisar "{query}" na Web
                            </button>
                        </div>
                    )}

                    {filtered.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleAdd(product)}
                            className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-4 transition-colors group border-b border-slate-50 dark:border-slate-800/50 last:border-none"
                        >
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xl">
                                🛍️
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                                    {product.brand}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-primary">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </div>
                                <div className="text-xs text-slate-400">preço médio</div>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShoppingCart size={18} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 text-xs text-center text-slate-400">
                    Dica: Clique no produto para adicionar à lista
                </div>
            </div>
        </div>
    );
};
