import type { Category } from '../types';

const KEYWORDS: Record<Category, string[]> = {
    hortifruti: ['maçã', 'banana', 'uva', 'batata', 'cenoura', 'alface', 'tomate', 'cebola', 'fruta', 'legume', 'verdura', 'morango', 'limão', 'abacate', 'laranja', 'mamao', 'melancia', 'abacaxi', 'pimentão', 'alho'],
    padaria: ['pão', 'bolo', 'torta', 'sonho', 'biscoito', 'bolacha', 'baguete', 'croissant', 'pao'],
    carnes: ['carne', 'frango', 'boi', 'peixe', 'linguiça', 'bife', 'filé', 'hambúrguer', 'bacon', 'presunto', 'salsicha', 'costela', 'picanha'],
    laticinios: ['leite', 'queijo', 'manteiga', 'requeijão', 'iogurte', 'creme de leite', 'margarina', 'nata', 'mussarela', 'prato'],
    bebidas: ['refrigerante', 'suco', 'vinho', 'cerveja', 'água', 'vodka', 'chá', 'café', 'coca', 'guaraná', 'pepsi'],
    mercearia: ['arroz', 'feijão', 'macarrão', 'óleo', 'açúcar', 'sal', 'tempero', 'farinha', 'café', 'molho', 'azeite', 'vinagre', 'bolacha'],
    congelados: ['sorvete', 'lasanha', 'pizza', 'nuggets', 'batata congelada'],
    limpeza: ['sabão', 'detergente', 'água sanitária', 'bucha', 'desinfetante', 'álcool', 'amaciante', 'veja', 'ypê', 'papel toalha'],
    higiene: ['sabonete', 'shampoo', 'condicionador', 'pasta', 'escova', 'papel higiênico', 'desodorante', 'cotonete', 'fralda'],
    pets: ['ração', 'petisco', 'areia', 'sachê', 'pedigree', 'whiskas'],
    outros: []
};

export const categorizeItem = (name: string): Category => {
    const lowerName = name.toLowerCase();

    // Check exact matches or partial matches
    for (const [category, keywords] of Object.entries(KEYWORDS)) {
        if (keywords.some(k => lowerName.includes(k))) {
            return category as Category;
        }
    }

    return 'outros';
};
