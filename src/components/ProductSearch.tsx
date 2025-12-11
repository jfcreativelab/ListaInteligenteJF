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
                    {/* Empty State / Suggestions */}
                    {query.length <= 1 && (
                        <div className="p-2 space-y-4">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                                Sugestões Populares
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                                {MOCK_PRODUCTS.slice(0, 6).map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleAdd(product)}
                                        className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-left hover:border-primary/50 transition-colors group"
                                    >
                                        <div className="text-2xl mb-2">🛍️</div>
                                        <div className="font-medium text-slate-700 dark:text-slate-200 text-sm truncate">
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-primary font-bold mt-1">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
                                <p className="text-sm text-primary font-medium">
                                    💡 Digite "Leite", "Pão", "Carne"...
                                </p>
                            </div>
                        </div>
                    )}

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

                    {query.length > 1 && (
                        <div className="space-y-4">
                            {/* Group items by category */}
                            {Array.from(new Set(filtered.map(item => item.category))).map(catSlug => (
                                <div key={catSlug}>
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 bg-slate-50 dark:bg-slate-800/50 py-1 rounded">
                                        {catSlug}
                                    </h5>
                                    {filtered.filter(item => item.category === catSlug).map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleAdd(product)}
                                            className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-4 transition-colors group border-b border-slate-50 dark:border-slate-800/50 last:border-none"
                                        >
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-lg shadow-sm">
                                                🛍️
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                                                    {product.name}
                                                </h4>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                                                    {product.brand}
                                                </span>
                                            </div>
                                            <div className="text-right whitespace-nowrap">
                                                <div className="font-bold text-primary">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                                </div>
                                            </div>
                                            <div className="p-2 bg-primary/10 rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ShoppingCart size={16} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 text-xs text-center text-slate-400">
                    Dica: Clique no produto para adicionar à lista
                </div>
            </div>
        </div>
    );
};
