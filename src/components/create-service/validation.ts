export const validatePhoneNumber = (number: string) => {
  const phoneRegex = /^(\+91[-\s]?)?[0-9]{10}$/;
  return phoneRegex.test(number.replace(/\s+/g, ''));
};