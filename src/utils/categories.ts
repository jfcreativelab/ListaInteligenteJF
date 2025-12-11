import type { Category } from '../types';
import { Apple, Beef, Beer, Carrot, Dog, Droplet, IceCream, Milk, Package, Sparkles } from 'lucide-react';

export const CATEGORY_LABELS: Record<Category, string> = {
    hortifruti: 'Hortifruti',
    padaria: 'Padaria',
    carnes: 'Carnes',
    laticinios: 'Laticínios',
    bebidas: 'Bebidas',
    mercearia: 'Mercearia',
    congelados: 'Congelados',
    limpeza: 'Limpeza',
    higiene: 'Higiene',
    pets: 'Pets',
    outros: 'Outros',
};

export const CATEGORY_COLORS: Record<Category, string> = {
    hortifruti: 'bg-green-500',
    padaria: 'bg-yellow-500',
    carnes: 'bg-red-500',
    laticinios: 'bg-orange-400',
    bebidas: 'bg-blue-500',
    mercearia: 'bg-indigo-500',
    congelados: 'bg-cyan-500',
    limpeza: 'bg-purple-500',
    higiene: 'bg-pink-500',
    pets: 'bg-teal-500',
    outros: 'bg-slate-500',
};

export const CATEGORY_HEX: Record<Category, string> = {
    hortifruti: '#22c55e', // green-500
    padaria: '#eab308',   // yellow-500
    carnes: '#ef4444',    // red-500
    laticinios: '#fb923c',// orange-400
    bebidas: '#3b82f6',   // blue-500
    mercearia: '#6366f1', // indigo-500
    congelados: '#06b6d4',// cyan-500
    limpeza: '#a855f7',   // purple-500
    higiene: '#ec4899',   // pink-500
    pets: '#14b8a6',      // teal-500
    outros: '#64748b',    // slate-500
};

// Lucide icons for each category
export const CATEGORY_ICONS: Record<Category, any> = {
    hortifruti: Apple,
    padaria: Carrot,
    carnes: Beef,
    laticinios: Milk,
    bebidas: Beer,
    mercearia: Package,
    congelados: IceCream,
    limpeza: Sparkles,
    higiene: Droplet,
    pets: Dog,
    outros: Package
};
