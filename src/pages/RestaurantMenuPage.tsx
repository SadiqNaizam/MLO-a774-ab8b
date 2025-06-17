import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import MenuItemCard from '@/components/MenuItemCard';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; // Assuming useToast is from shadcn/ui

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface RestaurantDetails {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  deliveryTime: string;
  menu: MenuCategory[];
}

const placeholderRestaurantDetails: RestaurantDetails = {
  id: '1',
  name: 'Gourmet Burger Kitchen',
  logoUrl: 'https://source.unsplash.com/random/100x100/?logo,burger',
  rating: 4.5,
  deliveryTime: '25-35 min',
  menu: [
    {
      name: 'Signature Burgers',
      items: [
        { id: 'b1', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, lettuce, tomato, special sauce.', price: 12.99, imageUrl: 'https://source.unsplash.com/random/300x169/?cheeseburger' },
        { id: 'b2', name: 'Spicy Jalapeño Burger', description: 'Beef patty, pepper jack, jalapeños, spicy mayo.', price: 13.50, imageUrl: 'https://source.unsplash.com/random/300x169/?spicy,burger' },
      ],
    },
    {
      name: 'Sides',
      items: [
        { id: 's1', name: 'French Fries', description: 'Crispy golden fries.', price: 4.50, imageUrl: 'https://source.unsplash.com/random/300x169/?fries' },
        { id: 's2', name: 'Onion Rings', description: 'Battered and fried onion rings.', price: 5.00, imageUrl: 'https://source.unsplash.com/random/300x169/?onionrings' },
      ],
    },
    {
      name: 'Drinks',
      items: [
        { id: 'd1', name: 'Cola', price: 2.50, imageUrl: 'https://source.unsplash.com/random/300x169/?soda,drink' },
        { id: 'd2', name: 'Lemonade', price: 3.00, imageUrl: 'https://source.unsplash.com/random/300x169/?lemonade' },
      ],
    },
  ],
};

const RestaurantMenuPage: React.FC = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<{ [key: string]: { item: MenuItem; quantity: number } }>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log(`RestaurantMenuPage loaded for ID: ${restaurantId}`);
    setLoading(true);
    // Simulate fetching restaurant details
    setTimeout(() => {
      // In a real app, fetch based on restaurantId
      const foundRestaurant = restaurantId === placeholderRestaurantDetails.id ? placeholderRestaurantDetails : null;
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        // By default, open the first category
        if (foundRestaurant.menu.length > 0) {
          setOpenCategories({ [foundRestaurant.menu[0].name]: true });
        }
      } else {
        // Handle restaurant not found, e.g., navigate to a 404 page or show message
        console.error(`Restaurant with ID ${restaurantId} not found.`);
        navigate('/not-found', { replace: true });
      }
      setLoading(false);
    }, 1000);
  }, [restaurantId, navigate]);

  const handleAddItem = (item: { id: string; name: string; price: number }) => {
    setCartItems(prev => {
      const existingItem = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          item: item as MenuItem, // Cast for simplicity here
          quantity: existingItem ? existingItem.quantity + 1 : 1,
        },
      };
    });
    // The MenuItemCard itself shows a toast, so not duplicating here.
    // If central toast management is preferred, this is where it would go.
  };
  
  const handleRemoveItem = (itemId: string | number) => {
    setCartItems(prev => {
      const existingItem = prev[itemId.toString()];
      if (existingItem && existingItem.quantity > 1) {
        return { ...prev, [itemId.toString()]: { ...existingItem, quantity: existingItem.quantity - 1 } };
      } else {
        const { [itemId.toString()]: _, ...rest } = prev; // Remove item
        return rest;
      }
    });
  };

  const totalCartItems = Object.values(cartItems).reduce((sum, { quantity }) => sum + quantity, 0);
  const totalCartPrice = Object.values(cartItems).reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header variant="restaurantDetail" showBackButton={true} onBackClick={() => navigate(-1)} restaurantName="Loading..." />
        <main className="flex-grow p-4 space-y-4 pb-28"> {/* pb for sticky footer and BottomTabBar */}
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </main>
        <BottomTabBar />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header variant="pageTitle" title="Error" showBackButton onBackClick={() => navigate('/')}/>
        <p className="text-xl">Restaurant not found.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="restaurantDetail"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        restaurantName={restaurant.name}
        rating={restaurant.rating.toFixed(1)}
        deliveryTime={restaurant.deliveryTime}
        cartItemCount={totalCartItems}
        onCartClick={() => alert(`Cart Clicked! ${totalCartItems} items, Total: $${totalCartPrice.toFixed(2)}`)} // Placeholder for cart view
      />
      <main className="flex-grow pb-28"> {/* Padding for sticky button and tab bar */}
        <div className="p-4 flex items-center gap-4 bg-card border-b">
            <Avatar className="h-16 w-16">
                <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
                <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                {/* Name, rating, delivery already in header, could add more details here if needed */}
                <p className="text-sm text-muted-foreground">Welcome to {restaurant.name}!</p>
            </div>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)]"> {/* Adjust height considering header, restaurant info, sticky button, tab bar */}
          <div className="p-2 md:p-4 space-y-4">
            {restaurant.menu.map((category, index) => (
              <Collapsible 
                key={category.name} 
                open={openCategories[category.name] || false}
                onOpenChange={(isOpen) => setOpenCategories(prev => ({...prev, [category.name]: isOpen}))}
                defaultOpen={index === 0} // Open first category by default
              >
                <CollapsibleTrigger className="w-full flex justify-between items-center p-3 bg-muted/50 rounded-md hover:bg-muted">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <ChevronDown className={`h-5 w-5 transition-transform ${openCategories[category.name] ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        {...item}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        quantityInCart={cartItems[item.id]?.quantity || 0}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </main>
        
      {totalCartItems > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-3 bg-background border-t shadow-top_sm_dark z-30"> {/* Position above BottomTabBar */}
          <Button 
            size="lg" 
            className="w-full flex justify-between items-center"
            onClick={() => alert(`Checkout clicked! Total: $${totalCartPrice.toFixed(2)}`)} // Placeholder for checkout
          >
            <span>View Cart ({totalCartItems} items)</span>
            <span>${totalCartPrice.toFixed(2)}</span>
          </Button>
        </div>
      )}
      <BottomTabBar />
    </div>
  );
};

export default RestaurantMenuPage;