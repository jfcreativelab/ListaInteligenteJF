import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ShoppingContextType, ShoppingItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ShoppingItem[]>(() => {
        try {
            const saved = localStorage.getItem('shoppingList');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [budget, setBudget] = useState<number>(() => {
        try {
            const saved = localStorage.getItem('budget');
            return saved ? Number(saved) : 0;
        } catch {
            return 0;
        }
    });

    useEffect(() => {
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('budget', budget.toString());
    }, [budget]);

    const addItem = (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'checked'>) => {
        const newItem: ShoppingItem = {
            ...item,
            id: uuidv4(),
            checked: false,
            createdAt: Date.now(),
        };
        setItems(prev => [newItem, ...prev]);
    };

    const toggleItem = (id: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id);
            if (!item) return prev;
            const updatedItem = { ...item, checked: !item.checked };
            return prev.map(i => i.id === id ? updatedItem : i);
        });
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, updates: Partial<ShoppingItem>) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const clearList = () => setItems([]);

    const importList = (newItems: ShoppingItem[]) => setItems(newItems);

    const total = items.reduce((acc, item) => {
        return acc + (item.price * item.qty);
    }, 0);

    const exportToWhatsApp = () => {
        let text = '*🛒 Lista Inteligente JF*\n\n';

        const pending = items.filter(i => !i.checked);
        const done = items.filter(i => i.checked);

        if (pending.length > 0) {
            text += '*A Comprar:*\n';
            pending.forEach(item => {
                text += `⬜ ${item.qty}x ${item.name}`;
                if (item.price > 0) text += ` (R$ ${item.price.toFixed(2)})`;
                text += '\n';
            });
            text += '\n';
        }

        if (done.length > 0) {
            text += '*Comprados:*\n';
            done.forEach(item => {
                text += `✅ ${item.qty}x ${item.name}\n`;
            });
            text += '\n';
        }

        text += `*Total: R$ ${total.toFixed(2)}*`;

        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <ShoppingContext.Provider value={{
            items,
            addItem,
            toggleItem,
            removeItem,
            updateItem,
            clearList,
            importList,
            total,
            budget,
            setBudget,
            exportToWhatsApp
        }}>
            {children}
        </ShoppingContext.Provider>
    );
};

export const useShopping = () => {
    const context = useContext(ShoppingContext);
    if (!context) throw new Error('useShopping must be used within a ShoppingProvider');
    return context;
};
