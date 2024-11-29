interface CreatePostData {
  content: string;
  location: string;
  image: string | null;
  timestamp: string;
}

export const createPost = async (postData: CreatePostData) => {
  const response = await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};