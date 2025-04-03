
/**
 * Extracts initials from a name for avatar fallbacks
 * @param name The name to extract initials from
 * @param fallback The fallback character if no name is provided
 * @returns 1-2 characters for the avatar
 */
export const getInitials = (name?: string | null, fallback: string = '?'): string => {
  if (!name) return fallback;
  
  // Split on spaces and get first letters of each part
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // If only one part, return first letter
    return parts[0].charAt(0).toUpperCase();
  } else {
    // If multiple parts, return first letter of first + first letter of last
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
};

/**
 * Gets a consistent background color based on a string (name or id)
 * @param str The string to hash for color
 * @returns CSS color class from Tailwind
 */
export const getAvatarColorClass = (str?: string | null): string => {
  if (!str) return 'bg-gray-400';
  
  const colors = [
    'bg-red-500', 
    'bg-orange-500', 
    'bg-amber-500',
    'bg-yellow-500', 
    'bg-lime-500', 
    'bg-green-500',
    'bg-emerald-500', 
    'bg-teal-500', 
    'bg-cyan-500',
    'bg-sky-500', 
    'bg-blue-500', 
    'bg-indigo-500',
    'bg-violet-500', 
    'bg-purple-500', 
    'bg-fuchsia-500',
    'bg-pink-500', 
    'bg-rose-500'
  ];
  
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Get positive index within colors array length
  const index = Math.abs(hash) % colors.length;
  
  return colors[index];
};
