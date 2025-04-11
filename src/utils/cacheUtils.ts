
/**
 * Advanced caching utilities for performance optimization
 */

type CacheItem<T> = {
  value: T;
  timestamp: number;
  lastAccessed: number;
  accessCount: number;
};

export class GlobalCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxSize: number = 200; // Maximum number of items in cache
  
  // Get an item from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Update access stats
    item.lastAccessed = Date.now();
    item.accessCount++;
    
    return item.value;
  }
  
  // Get an item with metadata
  getWithMetadata<T>(key: string): (CacheItem<T> & { ttl: number }) | null {
    const item = this.cache.get(key) as CacheItem<T>;
    if (!item) return null;
    
    // Update access stats
    item.lastAccessed = Date.now();
    item.accessCount++;
    
    // Calculate time since creation
    const ttl = Date.now() - item.timestamp;
    
    return { ...item, ttl };
  }
  
  // Set an item in cache with expiration
  set<T>(key: string, value: T, ttlMs: number = 60000): void {
    // Check if we need to evict items
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0
    });
    
    // Set expiration if provided
    if (ttlMs > 0) {
      setTimeout(() => {
        const item = this.cache.get(key);
        // Only expire if it's the same item (not been replaced)
        if (item && item.timestamp === item.timestamp) {
          this.cache.delete(key);
        }
      }, ttlMs);
    }
  }
  
  // Check if key exists in cache
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  // Delete a specific key
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  // Clear all cache
  clear(): void {
    this.cache.clear();
  }
  
  // Clear all cache items matching a prefix
  clearPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
  
  // Evict least recently used items when cache gets too large
  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      // Prioritize items with fewer accesses and older last accessed time
      if (item.lastAccessed < oldestAccess) {
        oldestAccess = item.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  
  // Get cache stats
  getStats(): { size: number, averageAge: number } {
    let totalAge = 0;
    const now = Date.now();
    
    for (const item of this.cache.values()) {
      totalAge += now - item.timestamp;
    }
    
    const averageAge = this.cache.size > 0 ? totalAge / this.cache.size : 0;
    
    return {
      size: this.cache.size,
      averageAge
    };
  }
}

// Create a singleton instance
export const globalCache = new GlobalCache();

/**
 * Higher-order function that wraps an API call with caching
 * @param fn The function to cache
 * @param cacheKey The key to use for caching
 * @param ttlMs Time-to-live in milliseconds
 * @returns A cached version of the function
 */
export function withCache<T>(
  fn: () => Promise<T>,
  cacheKey: string,
  ttlMs: number = 60000
): () => Promise<T> {
  return async () => {
    // Check if data is in cache
    const cachedData = globalCache.get<T>(cacheKey);
    if (cachedData !== null) {
      console.debug(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    // If not in cache, call the original function
    console.debug(`Cache miss for ${cacheKey}, fetching data...`);
    const result = await fn();
    
    // Store result in cache
    globalCache.set(cacheKey, result, ttlMs);
    
    return result;
  };
}

// Register cache monitoring for debug purposes
if (process.env.NODE_ENV === 'development') {
  (window as any).globalCache = globalCache;
  
  // Log cache stats every 30 seconds in development
  setInterval(() => {
    console.debug('[Cache Stats]', globalCache.getStats());
  }, 30000);
}
