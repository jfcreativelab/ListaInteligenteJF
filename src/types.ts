export type Category =
    | 'hortifruti'
    | 'padaria'
    | 'carnes'
    | 'laticinios'
    | 'bebidas'
    | 'mercearia'
    | 'congelados'
    | 'limpeza'
    | 'higiene'
    | 'pets'
    | 'outros';

export interface ShoppingItem {
    id: string;
    name: string;
    qty: number;
    price: number;
    category: Category;
    checked: boolean;
    createdAt: number;
}

export interface ShoppingContextType {
    items: ShoppingItem[];
    addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'checked'>) => void;
    toggleItem: (id: string) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
    clearList: () => void;
    importList: (items: ShoppingItem[]) => void;
    total: number;
    budget: number;
    setBudget: (value: number) => void;
    exportToWhatsApp: () => void;
}
