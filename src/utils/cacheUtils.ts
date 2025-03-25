
/**
 * A simple in-memory cache implementation with time-based expiration
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
}

export class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private maxSize: number;
  private cleanupInterval: number | null = null;

  constructor(options?: { maxSize?: number, cleanupInterval?: number }) {
    this.maxSize = options?.maxSize || 100;
    
    // Set up periodic cleanup if interval is provided
    if (options?.cleanupInterval) {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, options.cleanupInterval);
    }
  }

  /**
   * Store a value in the cache
   * @param key Cache key
   * @param value Value to store
   * @param ttl Time to live in milliseconds (optional)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.DEFAULT_TTL);
    
    this.cache.set(key, {
      value,
      timestamp: now,
      expiresAt
    });
    
    // Implement LRU-like behavior if cache exceeds max size
    if (this.cache.size > this.maxSize) {
      this.evictOldest();
    }
  }

  /**
   * Retrieve a value from the cache
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete a key from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Cleanup expired items
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict the oldest entry from the cache
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    if (this.cleanupInterval !== null) {
      window.clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Create a global instance for shared usage
export const globalCache = new MemoryCache({
  maxSize: 200,
  cleanupInterval: 60 * 1000 // Cleanup every minute
});

/**
 * Hook to use with async functions to cache their results
 * @param fn The async function to cache
 * @param keyPrefix A prefix for the cache key
 * @param ttl Time to live in milliseconds
 * @returns A cached version of the function
 */
export function withCache<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyPrefix: string,
  ttl?: number
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
    
    // Check if we have a cached result
    const cachedResult = globalCache.get<T>(cacheKey);
    if (cachedResult !== null) {
      console.debug(`Cache hit for ${cacheKey}`);
      return cachedResult;
    }
    
    // Call the original function
    const result = await fn(...args);
    
    // Store the result in cache
    globalCache.set(cacheKey, result, ttl);
    console.debug(`Cache miss for ${cacheKey}, stored new result`);
    
    return result;
  };
}
