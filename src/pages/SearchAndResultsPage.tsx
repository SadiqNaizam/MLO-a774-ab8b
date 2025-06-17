import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import RestaurantCard from '@/components/RestaurantCard';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Filter, SortAsc } from 'lucide-react';

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

const allRestaurants: Restaurant[] = [
  { id: '1', name: 'Gourmet Burger Kitchen', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,burger', rating: 4.5, reviewCount: 150, cuisineTypes: ['Burgers', 'American'], deliveryTimeEstimate: '25-35 min', deliveryFee: '$2.99', offer: '10% OFF' },
  { id: '2', name: 'Napoli Pizzeria', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,pizza', rating: 4.8, reviewCount: 200, cuisineTypes: ['Pizza', 'Italian'], deliveryTimeEstimate: '30-40 min', deliveryFee: 'Free' },
  { id: '3', name: 'Sushi World', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,sushi', rating: 4.3, reviewCount: 90, cuisineTypes: ['Sushi', 'Japanese'], deliveryTimeEstimate: '35-45 min', offer: 'Combo Deal' },
  { id: '4', name: 'Veggie Delight', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,vegetarian', rating: 4.7, cuisineTypes: ['Vegetarian', 'Healthy'], deliveryTimeEstimate: '20-30 min', deliveryFee: '$1.00', offer: 'Free Drink' },
  { id: '5', name: 'Taco Town', imageUrl: 'https://source.unsplash.com/random/400x225/?restaurant,tacos', rating: 4.2, cuisineTypes: ['Mexican', 'Tacos'], deliveryTimeEstimate: '25-35 min' },
];


const SearchAndResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ cuisines: string[]; hasOffer: boolean }>({ cuisines: [], hasOffer: false });
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    console.log('SearchAndResultsPage loaded');
    // Example: if navigated from HomePage search icon, autofocus and perform initial search
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('q');
    if (initialSearch) {
      setSearchTerm(initialSearch);
      performSearch(initialSearch, filters, sortBy);
    }
  }, [location.search]);

  const performSearch = (term: string, currentFilters: typeof filters, currentSortBy: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    console.log(`Searching for: ${term}, Filters: ${JSON.stringify(currentFilters)}, Sort: ${currentSortBy}`);
    setTimeout(() => {
      let filteredResults = allRestaurants.filter(r =>
        r.name.toLowerCase().includes(term.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(term.toLowerCase()))
      );

      if (currentFilters.cuisines.length > 0) {
        filteredResults = filteredResults.filter(r => 
          currentFilters.cuisines.some(fc => r.cuisineTypes.map(c => c.toLowerCase()).includes(fc.toLowerCase()))
        );
      }
      if (currentFilters.hasOffer) {
        filteredResults = filteredResults.filter(r => r.offer);
      }

      if (currentSortBy === 'rating') {
        filteredResults.sort((a, b) => b.rating - a.rating);
      } else if (currentSortBy === 'deliveryTime') {
        // Simplified sort, assumes deliveryTimeEstimate is like "20-30 min"
        filteredResults.sort((a, b) => 
            parseInt(a.deliveryTimeEstimate.split('-')[0]) - parseInt(b.deliveryTimeEstimate.split('-')[0])
        );
      }
      
      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  const handleSearchSubmit = (currentSearchTerm: string) => {
    setSearchTerm(currentSearchTerm);
    performSearch(currentSearchTerm, filters, sortBy);
  };

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurant/${id}`);
  };
  
  const handleApplyFilters = () => {
    performSearch(searchTerm, filters, sortBy);
    // Close sheet - SheetClose button will do this.
  };

  const availableCuisines = Array.from(new Set(allRestaurants.flatMap(r => r.cuisineTypes)));

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        variant="searchFocus"
        showSearch={true}
        searchPlaceholder="Search restaurants or dishes..."
        onSearchSubmit={handleSearchSubmit}
        onVoiceSearchClick={() => alert('Voice search clicked!')}
        onQrScanClick={() => alert('QR scan clicked!')}
      />
      <main className="flex-grow pb-16 pt-4 px-2 md:px-4">
        <div className="flex justify-end mb-3 px-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters & Sort
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters & Sort</SheetTitle>
                <SheetDescription>
                  Refine your search results.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div>
                  <Label className="text-base font-semibold">Sort By</Label>
                  <RadioGroup defaultValue="relevance" value={sortBy} onValueChange={setSortBy} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="relevance" id="sort-relevance" />
                      <Label htmlFor="sort-relevance">Relevance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rating" id="sort-rating" />
                      <Label htmlFor="sort-rating">Rating</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deliveryTime" id="sort-deliveryTime" />
                      <Label htmlFor="sort-deliveryTime">Delivery Time</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                    <Label className="text-base font-semibold">Cuisines</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {availableCuisines.map(cuisine => (
                            <div key={cuisine} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`cuisine-${cuisine}`} 
                                    checked={filters.cuisines.includes(cuisine)}
                                    onCheckedChange={(checked) => {
                                        setFilters(prev => ({
                                            ...prev,
                                            cuisines: checked ? [...prev.cuisines, cuisine] : prev.cuisines.filter(c => c !== cuisine)
                                        }));
                                    }}
                                />
                                <Label htmlFor={`cuisine-${cuisine}`}>{cuisine}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <Label className="text-base font-semibold">Offers</Label>
                    <div className="mt-2 flex items-center space-x-2">
                        <Checkbox 
                            id="filter-offers"
                            checked={filters.hasOffer}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasOffer: !!checked }))}
                        />
                        <Label htmlFor="filter-offers">Has Offers/Deals</Label>
                    </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleApplyFilters}>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-200px)]"> {/* Adjust height based on header/footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
              {results.map((resto) => (
                <RestaurantCard
                  key={resto.id}
                  {...resto}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          searchTerm && <p className="text-center text-muted-foreground p-4">No results found for "{searchTerm}". Try different keywords or filters.</p>
        )}
         {!searchTerm && !loading && results.length === 0 && (
            <p className="text-center text-muted-foreground p-4">Search for your favorite food or restaurants.</p>
        )}
      </main>
      <BottomTabBar />
    </div>
  );
};

export default SearchAndResultsPage;