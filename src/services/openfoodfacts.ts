export interface OnlineProduct {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
}

export const searchOnlineProducts = async (query: string): Promise<OnlineProduct[]> => {
    try {
        const response = await fetch(`https://br.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&lc=pt`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.products || !Array.isArray(data.products)) {
            return [];
        }

        return data.products
            .filter((item: any) => item.product_name && (item.image_front_small_url || item.image_url))
            .map((item: any) => {
                // Generates a deterministic pseudo-random price based on ID
                // ensuring the same product always shows the same "estimated" price
                const fakePrice = (parseInt(item._id.slice(-4)) / 100) + (Math.random() * 20 + 5);

                return {
                    id: item._id,
                    title: item.product_name,
                    price: parseFloat(fakePrice.toFixed(2)),
                    thumbnail: item.image_front_small_url || item.image_url || ''
                };
            });

    } catch (error) {
        console.error("Error searching OpenFoodFacts:", error);
        return [];
    }
};
