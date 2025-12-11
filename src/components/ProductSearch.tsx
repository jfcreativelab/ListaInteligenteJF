import { useState, useEffect } from 'react';
import { Search, X, ShoppingCart, Globe, Package } from 'lucide-react';
import { MOCK_PRODUCTS } from '../utils/productDb';
import { searchMercadoLivre, type MLEtem } from '../services/mercadolivre';
import { useShopping } from '../context/ShoppingContext';
import { toast } from 'sonner';
import { categorizeItem } from '../utils/autocategorize';

interface ProductSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProductSearch = ({ isOpen, onClose }: ProductSearchProps) => {
    const { addItem } = useShopping();
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'local' | 'online'>('local');
    const [onlineResults, setOnlineResults] = useState<MLEtem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchMode === 'online' && query.length > 2) {
            const delayDebounceFn = setTimeout(async () => {
                setIsLoading(true);
                const results = await searchMercadoLivre(query);
                setOnlineResults(results);
                setIsLoading(false);
            }, 600);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [query, searchMode]);

    if (!isOpen) return null;

    const filtered = query.length > 1
        ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleAdd = (name: string, price: number) => {
        addItem({
            name: name,
            price: price,
            qty: 1,
            category: categorizeItem(name)
        });
        toast.success(`${name} adicionado!`);
        onClose();
        setQuery('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-100 dark:border-slate-800 animate-scale-up">

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setSearchMode('local')}
                        className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${searchMode === 'local' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        <Package size={18} />
                        Catálogo Local
                    </button>
                    <button
                        onClick={() => setSearchMode('online')}
                        className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${searchMode === 'online' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        <Globe size={18} />
                        Busca Online (ML)
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-3 items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <Search className="text-slate-400" />
                    <input
                        type="text"
                        placeholder={searchMode === 'local' ? "Buscar no app..." : "Buscar no Mercado Livre..."}
                        className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 bg-slate-50/30 dark:bg-slate-900/30">
                    {/* LOCAL SEARCH */}
                    {searchMode === 'local' && (
                        <>
                            {query.length <= 1 && (
                                <div className="p-2 space-y-4">
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Sugestões</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        {MOCK_PRODUCTS.slice(0, 4).map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleAdd(product.name, product.price)}
                                                className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-left hover:border-primary/50 transition-colors shadow-sm"
                                            >
                                                <div className="font-medium text-slate-700 dark:text-slate-200 text-sm truncate">{product.name}</div>
                                                <div className="text-xs text-primary font-bold mt-1">R$ {product.price.toFixed(2)}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-center py-4">
                                        <button onClick={() => setSearchMode('online')} className="text-primary text-sm font-medium hover:underline">
                                            Não achou? Buscar Online &rarr;
                                        </button>
                                    </div>
                                </div>
                            )}

                            {filtered.length > 0 ? (
                                <div className="space-y-4">
                                    {Array.from(new Set(filtered.map(item => item.category))).map(catSlug => (
                                        <div key={catSlug}>
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">{catSlug}</h5>
                                            {filtered.filter(item => item.category === catSlug).map(product => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => handleAdd(product.name, product.price)}
                                                    className="w-full text-left p-3 bg-white dark:bg-slate-800 mb-1 rounded-xl flex items-center gap-4 hover:shadow-md transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                                >
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-lg">🛍️</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">{product.name}</h4>
                                                        <span className="text-xs text-slate-500">{product.brand}</span>
                                                    </div>
                                                    <div className="font-bold text-primary">R$ {product.price.toFixed(2)}</div>
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : query.length > 1 && (
                                <div className="text-center py-10">
                                    <p className="text-slate-500 mb-4">Nada encontrado no catálogo local.</p>
                                    <button
                                        onClick={() => setSearchMode('online')}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-light transition shadow-lg shadow-primary/20"
                                    >
                                        Buscar "{query}" na Internet
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* ONLINE SEARCH */}
                    {searchMode === 'online' && (
                        <div>
                            {isLoading ? (
                                <div className="py-20 text-center text-slate-400">
                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p>Buscando ofertas...</p>
                                </div>
                            ) : onlineResults.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {onlineResults.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleAdd(item.title, item.price)}
                                            className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-left hover:shadow-lg transition-all flex flex-col gap-2 h-full"
                                        >
                                            <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden p-2">
                                                <img src={item.thumbnail} alt={item.title} className="max-h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">{item.title}</h4>
                                            </div>
                                            <div className="flex justify-between items-end mt-2">
                                                <div className="font-bold text-primary text-lg">R$ {item.price.toFixed(2)}</div>
                                                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                                                    <ShoppingCart size={16} />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : query.length > 2 && (
                                <div className="text-center py-10 text-slate-500">
                                    <p>Nenhum resultado encontrado no Mercado Livre.</p>
                                </div>
                            )}

                            {query.length <= 2 && (
                                <div className="text-center py-10 text-slate-400">
                                    <Globe size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Digite para pesquisar em milhares de produtos online.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
