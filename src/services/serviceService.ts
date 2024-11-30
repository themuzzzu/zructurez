interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image: string | null;
  contactInfo: string;
  availability: string;
  timestamp: string;
}

export const createService = async (serviceData: CreateServiceData) => {
  const response = await fetch('https://api.example.com/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error('Failed to create service');
  }

  return response.json();
};

export const getServices = async () => {
  const response = await fetch('https://api.example.com/services');
  
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
};