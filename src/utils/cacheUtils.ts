
/**
 * A robust in-memory cache implementation with time-based expiration and metadata
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
  lastAccessed: number;
}

export type CacheItemWithMetadata<T> = {
  value: T;
  timestamp: number;
  expiresAt: number;
  lastAccessed: number;
  ttl: number;
};

export class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private maxSize: number;
  private cleanupInterval: number | null = null;
  private hits = 0;
  private misses = 0;

  constructor(options?: { maxSize?: number, cleanupInterval?: number }) {
    this.maxSize = options?.maxSize || 100;
    
    // Set up periodic cleanup if interval is provided
    if (options?.cleanupInterval) {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, options.cleanupInterval);
    }
    
    // Setup storage event listener for cross-tab invalidation
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('cache-invalidate:')) {
        const cacheKey = e.key.replace('cache-invalidate:', '');
        this.delete(cacheKey);
      }
    });
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
      expiresAt,
      lastAccessed: now
    });
    
    // Implement LRU-like behavior if cache exceeds max size
    if (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
    
    // Notify other tabs about the update
    try {
      localStorage.setItem(`cache-timestamp:${key}`, now.toString());
    } catch (e) {
      // Ignore storage errors
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
      this.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    // Update last accessed time
    item.lastAccessed = Date.now();
    this.hits++;
    
    return item.value as T;
  }

  /**
   * Get a cache item with its metadata
   */
  getWithMetadata<T>(key: string): CacheItemWithMetadata<T> | null {
    const item = this.cache.get(key);
    
    if (!item || Date.now() > item.expiresAt) {
      return null;
    }
    
    // Update last accessed time
    item.lastAccessed = Date.now();
    
    return {
      ...item,
      ttl: item.expiresAt - item.timestamp,
      value: item.value as T
    };
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
    
    // Notify other tabs
    try {
      localStorage.setItem(`cache-invalidate:${key}`, Date.now().toString());
    } catch (e) {
      // Ignore storage errors
    }
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    
    // Notify other tabs
    try {
      localStorage.setItem('cache-invalidate:all', Date.now().toString());
    } catch (e) {
      // Ignore storage errors
    }
  }

  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache hit rate statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: hitRate.toFixed(2) + '%',
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  /**
   * Cleanup expired items
   */
  cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.debug(`[Cache] Cleaned up ${expiredCount} expired items`);
    }
  }

  /**
   * Evict the least recently used entries from the cache
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < lruTime) {
        lruTime = item.lastAccessed;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      console.debug(`[Cache] Evicting LRU item: ${lruKey}`);
      this.cache.delete(lruKey);
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
  maxSize: 500, // Increased from 200
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

// IndexedDB backed cache for larger objects
export class PersistentCache {
  private dbName: string;
  private storeName: string;
  private version: number;
  
  constructor(options: { dbName: string; storeName: string; version?: number }) {
    this.dbName = options.dbName;
    this.storeName = options.storeName;
    this.version = options.version || 1;
    this.initDB();
  }
  
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    
    const now = Date.now();
    const expiresAt = ttl ? now + ttl : 0; // 0 means no expiration
    
    store.put({
      key,
      value,
      timestamp: now,
      expiresAt
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to store in IndexedDB'));
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const data = request.result;
          if (!data) return resolve(null);
          
          // Check if expired
          if (data.expiresAt && data.expiresAt < Date.now()) {
            this.delete(key); // Clean up expired item
            return resolve(null);
          }
          
          resolve(data.value as T);
        };
        
        request.onerror = () => reject(new Error('Failed to retrieve from IndexedDB'));
      });
    } catch (error) {
      console.error('IndexedDB error:', error);
      return null;
    }
  }
  
  async delete(key: string): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.delete(key);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to delete from IndexedDB'));
    });
  }
  
  async clear(): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.clear();
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to clear IndexedDB store'));
    });
  }
}

// Create an instance for large datasets
export const largePersistentCache = new PersistentCache({
  dbName: 'zructures-cache',
  storeName: 'large-objects',
  version: 1
});
