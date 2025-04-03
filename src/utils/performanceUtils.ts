import React from 'react';

/**
 * Measures the execution time of an API call and logs it to the console.
 * @param {string} apiName - The name of the API being called.
 * @param {Function} apiCall - The function representing the API call.
 * @returns {Promise<T>} - The result of the API call.
 */
export async function measureApiCall<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await apiCall();
    return result;
  } finally {
    const end = performance.now();
    const duration = end - start;
    console.log(`${apiName} took ${duration.toFixed(2)}ms`);
  }
}

/**
 * Measures the time it takes to load a component and logs it to the console.
 * @param {string} componentName - The name of the component being loaded.
 * @param {Function} componentLoader - A function that imports the component.
 * @returns {Promise<React.ComponentType<any>>} - The loaded component.
 */
export async function measureComponentLoad(
  componentName: string,
  componentLoader: () => Promise<any>
): Promise<React.ComponentType<any>> {
  const start = performance.now();
  try {
    const component = await componentLoader();
    return component.default || component;
  } finally {
    const end = performance.now();
    const duration = end - start;
    console.log(`${componentName} loaded in ${duration.toFixed(2)}ms`);
  }
}

/**
 * Creates a debounced version of a function that delays its execution until after
 * a certain amount of time has passed since the last time it was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} - The debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Creates a throttled version of a function that only gets called once per given interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Logs user interactions for performance tracking and analytics.
 * @param {string} eventName - The name of the event being logged.
 * @param {object} metadata - Additional data associated with the event.
 */
export function logUserInteraction(eventName: string, metadata: object = {}): void {
  console.log(`User interaction: ${eventName}`, metadata);
  // In a real application, this would send data to an analytics service
}
