
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that returns the current pathname from react-router-dom's useLocation
 * @returns The current pathname
 */
export const usePathname = (): string => {
  const location = useLocation();
  return location.pathname;
};
