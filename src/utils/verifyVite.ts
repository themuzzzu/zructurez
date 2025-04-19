
export const verifyVite = () => {
  console.log('Verifying Vite installation...');
  try {
    // Check if we're running in a Vite environment
    const isViteEnv = import.meta.env !== undefined;
    
    if (isViteEnv) {
      console.log('Vite environment check successful');
      return true;
    } else {
      console.warn('Vite environment variables not detected - may be running in production build');
      return false;
    }
  } catch (error) {
    console.error('Error verifying Vite:', error);
    return false;
  }
};
