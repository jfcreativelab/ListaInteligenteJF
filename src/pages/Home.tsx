import { useState } from 'react';
import { AddItem } from '../components/AddItem';
import { ItemList } from '../components/ItemList';
import { Dashboard } from '../components/Dashboard';
import { ProductSearch } from '../components/ProductSearch';
import { useShopping } from '../context/ShoppingContext';
import { Moon, Sun, PieChart, Share2, Wallet, Search as SearchIcon } from 'lucide-react';
import clsx from 'clsx';

export const Home = () => {
    const { total, budget, setBudget, exportToWhatsApp } = useShopping();
    const [darkMode, setDarkMode] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showBudgetInput, setShowBudgetInput] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const budgetProgress = budget > 0 ? (total / budget) * 100 : 0;
    const isOverBudget = budget > 0 && total > budget;

    return (
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-32">
            {/* Header */}
            {/* Header */}
            <header className="p-6 flex justify-between items-center sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Lista Inteligente
                </h1>
                <div className="flex gap-2">
                    <button onClick={() => setShowSearch(true)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300" title="Pesquisar Preços">
                        <SearchIcon size={20} />
                    </button>
                    <button onClick={exportToWhatsApp} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition text-green-600 dark:text-green-500" title="Enviar no WhatsApp">
                        <Share2 size={20} />
                    </button>
                    <button onClick={() => setShowDashboard(true)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300">
                        <PieChart size={20} />
                    </button>
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            {/* Budget Indicator */}
            {budget > 0 && (
                <div className="px-6 mb-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Gasto: R$ {total.toFixed(2)}</span>
                        <span>Meta: R$ {budget.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={clsx("h-full transition-all duration-500", isOverBudget ? "bg-red-500" : "bg-primary")}
                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 px-4 flex flex-col gap-6 pt-2">
                <AddItem />
                <ItemList />
            </main>

            {/* Total Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 p-4 pb-6 backdrop-blur-lg transition-colors duration-300 z-10">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowBudgetInput(!showBudgetInput)}>
                            <Wallet size={16} className="text-slate-400" />
                            <span className="text-slate-500 font-medium text-sm">
                                {budget > 0 ? (
                                    <span className={isOverBudget ? "text-red-500" : "text-green-500"}>
                                        Restante: R$ {(budget - total).toFixed(2)}
                                    </span>
                                ) : "Definir Meta"}
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                        </span>
                    </div>

                    {showBudgetInput && (
                        <div className="flex gap-2 animate-fade-in">
                            <input
                                type="number"
                                placeholder="Definir limite (R$)"
                                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none"
                                value={budget || ''}
                                onChange={(e) => setBudget(Number(e.target.value))}
                            />
                            <button
                                onClick={() => setShowBudgetInput(false)}
                                className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold"
                            >
                                OK
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Dashboard Modal */}
            {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}

            {/* Search Modal */}
            <ProductSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </div>
    );
}
