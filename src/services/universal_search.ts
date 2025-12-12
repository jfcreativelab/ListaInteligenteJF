export interface UniversalProduct {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    source: 'ML' | 'OFF';
    permalink: string;
}

/**
 * Searches for products using a CORS Proxy to access Mercado Livre's API.
 * This allows "Universal" search (Electronics, Home, etc) from the browser.
 */
export const searchUniversalProducts = async (query: string): Promise<UniversalProduct[]> => {
    try {
        // Using allorigins.win to bypass CORS restrictions on ML API
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=20`;

        const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);

        if (!response.ok) {
            throw new Error(`Proxy/API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            return [];
        }

        return data.results.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail.replace('http://', 'https://'), // Ensure HTTPS
            source: 'ML',
            permalink: item.permalink
        }));

    } catch (error) {
        console.error("Error searching Universal API:", error);
        return [];
    }
};
