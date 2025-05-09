import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Grid, List, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MainNav } from '@/components/nav/MainNav';

// Mock product data since we don't have proper image loading
const mockProducts = [
  {
    id: '1',
    title: 'Wireless Headphones',
    description: 'Noise cancelling over-ear wireless headphones with premium sound quality',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    price: 149.99,
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    price: 29.99,
    category: 'Fashion'
  },
  {
    id: '3',
    title: 'Smart Home Assistant',
    description: 'Voice-controlled smart home assistant with integrated AI features',
    imageUrl: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    price: 89.99,
    category: 'Electronics'
  },
  {
    id: '4',
    title: 'Handcrafted Coffee Mug',
    description: 'Artisan ceramic coffee mug, handmade by local craftsmen',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    price: 24.99,
    category: 'Home'
  },
  {
    id: '5',
    title: 'Yoga Exercise Mat',
    description: 'Non-slip, eco-friendly yoga mat for home or studio workouts',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    price: 39.99,
    category: 'Sports'
  },
  {
    id: '6',
    title: 'Vintage Denim Jacket',
    description: 'Classic vintage denim jacket with modern styling details',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    price: 79.99,
    category: 'Fashion'
  }
];

// Popular categories
const categories = [
  "Electronics", "Fashion", "Home", "Sports", "Beauty", 
  "Books", "Toys", "Groceries", "Automotive", "Garden"
];

const MarketplaceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Filter products based on search term and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <MainNav />
      <div className="container mx-auto p-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">Marketplace Hub</h1>
          <p className="text-lg mb-6">
            Discover amazing products and services from local businesses
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 bg-white/90 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>

        {/* Categories section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategory === '' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
            </h2>
            <p className="text-sm text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`${viewMode === 'list' ? 'flex' : ''}`}>
                <div className={`${viewMode === 'list' ? 'w-1/3' : ''}`}>
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`${viewMode === 'list' ? 'w-2/3 p-4' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
                      <Badge>{product.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                    <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found. Try a different search term or category.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MarketplaceHub;
