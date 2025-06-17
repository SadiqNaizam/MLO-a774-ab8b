import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CategoryChip from '@/components/CategoryChip';
import RestaurantCard from '@/components/RestaurantCard';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewCount?: number;
  cuisineTypes: string[];
  deliveryTimeEstimate: string;
  deliveryFee?: string;
  offer?: string;
}

const placeholderCategories = [
  { name: 'Burgers', imageUrl: 'https://source.unsplash.com/random/100x100/?burger,food' },
  { name: 'Pizza', imageUrl: 'https://source.unsplash.com/random/100x100/?pizza,food' },
  { name: 'Sushi', imageUrl: 'https://source.unsplash.com/random/100x100/?sushi,food' },
  { name: 'Italian', imageUrl: 'https://source.unsplash.com/random/100x100/?pasta,food' },
  { name: 'Desserts', imageUrl: 'https://source.unsplash.com/random/100x100/?cake,food' },
  { name: 'Chinese', imageUrl: 'https://source.unsplash.com/random/100x100/?chinese,food' },
  { name: 'Mexican', imageUrl: 'https://source.unsplash.com/random/100x100/?mexican,food' },
];

const placeholderRestaurants: Restaurant[] = [
  { id: '1', name: 'Gourmet Burger Kitchen', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,burger', rating: 4.5, reviewCount: 150, cuisineTypes: ['Burgers', 'American'], deliveryTimeEstimate: '25-35 min', deliveryFee: '$2.99', offer: '10% OFF' },
  { id: '2', name: 'Napoli Pizzeria', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,pizza', rating: 4.8, reviewCount: 200, cuisineTypes: ['Pizza', 'Italian'], deliveryTimeEstimate: '30-40 min', deliveryFee: 'Free' },
  { id: '3', name: 'Sushi World', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,sushi', rating: 4.3, reviewCount: 90, cuisineTypes: ['Sushi', 'Japanese'], deliveryTimeEstimate: '35-45 min', offer: 'Combo Deal' },
  { id: '4', name: 'Pasta Paradise', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,pasta', rating: 4.6, cuisineTypes: ['Italian', 'Pasta'], deliveryTimeEstimate: '20-30 min', deliveryFee: '$1.50' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('123 Main St, Anytown'); // Placeholder

  useEffect(() => {
    console.log('HomePage loaded');
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setRestaurants(placeholderRestaurants);
      setLoading(false);
    }, 1500);
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    console.log(`Category selected: ${categoryName}`);
    // In a real app, you would filter restaurants based on category
    setLoading(true);
    setTimeout(() => {
      const filtered = placeholderRestaurants.filter(r => 
        categoryName === 'All' || r.cuisineTypes.map(c => c.toLowerCase()).includes(categoryName.toLowerCase())
      );
      setRestaurants(filtered.length > 0 ? filtered : placeholderRestaurants); // Show all if filter empty
      setLoading(false);
    }, 500);
  };

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurant/${id}`);
  };

  const handleSearchAccess = () => {
    navigate('/search');
  };
  
  const handleLocationClick = () => {
    // Placeholder for location change logic
    alert("Change location feature clicked!");
    setCurrentLocation(prompt("Enter new location:", currentLocation) || currentLocation);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="default"
        showLocation={true}
        location={currentLocation}
        onLocationClick={handleLocationClick}
        onSearchAccessClick={handleSearchAccess}
        cartItemCount={0} // Example, update with actual cart logic
        onCartClick={() => navigate('/cart')} // Assuming a cart page exists or header handles it
      />
      <main className="flex-grow pb-16"> {/* pb-16 for BottomTabBar */}
        <section className="py-4 px-2 md:px-4">
          <h2 className="text-lg font-semibold mb-2 px-2">Categories</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-3 p-2">
              <CategoryChip
                key="all-categories"
                categoryName="All"
                isSelected={selectedCategory === 'All' || selectedCategory === null}
                onClick={() => handleCategorySelect('All')}
              />
              {placeholderCategories.map((cat) => (
                <CategoryChip
                  key={cat.name}
                  categoryName={cat.name}
                  imageUrl={cat.imageUrl}
                  isSelected={selectedCategory === cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="py-4 px-2 md:px-4">
          <h2 className="text-lg font-semibold mb-3 px-2">Featured Restaurants</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
              {restaurants.map((resto) => (
                <RestaurantCard
                  key={resto.id}
                  {...resto}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          ) : (
             <p className="text-center text-muted-foreground p-4">No restaurants found for "{selectedCategory}".</p>
          )}
        </section>
      </main>
      <BottomTabBar />
    </div>
  );
};

export default HomePage;