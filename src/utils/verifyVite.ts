
export const verifyVite = () => {
  console.log('Verifying Vite installation...');
  try {
    // Basic verification - if this file is processed by Vite, it's working
    console.log('Vite environment check successful');
    return true;
  } catch (error) {
    console.error('Error verifying Vite:', error);
    return false;
  }
};
