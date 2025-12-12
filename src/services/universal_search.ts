export interface UniversalProduct {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    source: 'ML' | 'OFF' | 'DUMMY';
    permalink?: string;
}

const PROXIES = [
    // Primary Proxy for ML: ThingProxy (Often reliable)
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
    // Secondary: AllOrigins (JSON wrapper)
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    // Backup: CodeTabs
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

/**
 * Searches for products using a Hybrid Strategy:
 * 1. DummyJSON: Fast, reliable, CORS-enabled (Electronics, Home, Basics)
 * 2. Mercado Livre (Proxied): fallback for specific Brazilian items
 */
export const searchUniversalProducts = async (query: string): Promise<UniversalProduct[]> => {
    let allResults: UniversalProduct[] = [];

    // STRATEGY 1: DummyJSON (Reliable, No Proxy)
    try {
        const dummyResponse = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=10`);
        if (dummyResponse.ok) {
            const dummyData = await dummyResponse.json();
            if (dummyData.products && Array.isArray(dummyData.products)) {
                const mappedDummy = dummyData.products.map((p: any) => ({
                    id: `dummy-${p.id}`,
                    title: p.title,
                    price: p.price * 5.5, // Rough Convert USD to BRL
                    thumbnail: p.thumbnail,
                    source: 'DUMMY',
                    permalink: '#'
                }));
                allResults = [...allResults, ...mappedDummy];
            }
        }
    } catch (e) {
        console.warn("DummyJSON failed", e);
    }

    // IF we have enough results, return early to be fast
    if (allResults.length >= 5) {
        return allResults;
    }

    // STRATEGY 2: Mercado Livre via Proxies (Broad, but Flaky)
    const mlTargetUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=15`;

    // Try proxies sequentially until one works
    for (const proxyGenerator of PROXIES) {
        try {
            const proxyUrl = proxyGenerator(mlTargetUrl);
            const response = await fetch(proxyUrl); // Add timeout logic ideally

            if (!response.ok) continue;

            let data;
            // Handle AllOrigins JSON wrapper
            if (proxyUrl.includes('allorigins.win')) {
                const wrapper = await response.json();
                data = JSON.parse(wrapper.contents);
            } else {
                data = await response.json();
            }

            if (!data.results || !Array.isArray(data.results)) {
                continue;
            }

            const mappedML = data.results.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                thumbnail: item.thumbnail.replace('http://', 'https://'),
                source: 'ML',
                permalink: item.permalink
            }));

            // Combine/Dedupe logic could go here, but for now just append
            allResults = [...allResults, ...mappedML];
            break; // Stop after first successful proxy

        } catch (error) {
            console.warn(`ML Proxy failed: ${proxyGenerator.name}`, error);
            continue;
        }
    }

    return allResults;
};
