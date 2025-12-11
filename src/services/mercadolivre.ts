export interface MLEtem {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    permalink: string;
}

export const searchMercadoLivre = async (query: string): Promise<MLEtem[]> => {
    try {
        // MLB1403 = Alimentos e Bebidas category
        const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&category=MLB1403&limit=20`);
        const data = await response.json();
        return data.results.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace('http://', 'https://'), // Ensure HTTPS
            permalink: item.permalink
        }));
    } catch (error) {
        console.error("Error searching Mercado Livre:", error);
        return [];
    }
};
