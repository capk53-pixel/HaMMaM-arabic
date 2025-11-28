// Must be the same as in service-worker.js
export const CACHE_NAME = 'hammam-fit-hup-cache-v1';

/**
 * Proactively caches image URLs from workout plans, exercise databases, etc.
 * @param items An array of items that might contain an imageUrl property.
 */
export const cacheImages = async (items: ({ imageUrl?: string })[]) => {
    if (!('caches' in window)) {
        console.log('Cache API not supported, skipping proactive caching.');
        return;
    }

    const urlsToCache = new Set<string>();
    items.forEach(item => {
        if (item.imageUrl && (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://'))) {
            urlsToCache.add(item.imageUrl);
        }
    });

    if (urlsToCache.size === 0) {
        return;
    }

    console.log(`Attempting to proactively cache ${urlsToCache.size} images.`);

    try {
        const cache = await caches.open(CACHE_NAME);
        const promises = Array.from(urlsToCache).map(url => 
            // Create a new request with CORS mode for cross-origin images
            cache.add(new Request(url, { mode: 'cors' })).catch(err => {
                console.warn(`Failed to cache image: ${url}`, err);
            })
        );
        await Promise.all(promises);
        console.log('Proactive image caching finished.');
    } catch (err) {
        console.error('Error during proactive image caching:', err);
    }
};
