export interface UniversalProduct {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    source: 'ML' | 'OFF';
    permalink: string;
}

const PROXIES = [
    // Primary: CORSProxy.io (Fast, reliable)
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    // Secondary: AllOrigins (JSON wrapper)
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    // Backup: CodeTabs
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

/**
 * Searches for products using a CORS Proxy to access Mercado Livre's API.
 * Uses multiple proxies for redundancy.
 */
export const searchUniversalProducts = async (query: string): Promise<UniversalProduct[]> => {
    const targetUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=20`;

    for (const proxyGenerator of PROXIES) {
        try {
            const proxyUrl = proxyGenerator(targetUrl);
            const response = await fetch(proxyUrl);

            if (!response.ok) continue;

            let data;
            // const contentType = response.headers.get("content-type");

            // Handle AllOrigins JSON wrapper
            if (proxyUrl.includes('allorigins.win')) {
                const wrapper = await response.json();
                data = JSON.parse(wrapper.contents);
            } else {
                data = await response.json();
            }

            if (!data.results || !Array.isArray(data.results)) {
                continue; // Try next proxy if data format is unexpected
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
            console.warn(`Proxy failed, trying next...`);
            continue;
        }
    }

    console.error("All proxies failed.");
    return [];
};
