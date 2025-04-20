
export const verifyVite = () => {
  try {
    console.log("Vite is working correctly.");
    return true;
  } catch (e) {
    console.error("Vite is not working:", e);
    return false;
  }
};
