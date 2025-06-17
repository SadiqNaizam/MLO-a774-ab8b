import React from 'react';
import { ArrowLeft, MapPin, Search, Mic, QrCode, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  variant?: 'default' | 'searchFocus' | 'pageTitle' | 'restaurantDetail';
  title?: string;
  location?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showLocation?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  onLocationClick?: () => void;
  onSearchAccessClick?: () => void; // For Home page search icon
  onSearchSubmit?: (searchTerm: string) => void;
  onVoiceSearchClick?: () => void;
  onQrScanClick?: () => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  className?: string;
  // Props for restaurant detail header
  restaurantName?: string;
  rating?: string | number;
  deliveryTime?: string;
}

const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  title,
  location,
  searchPlaceholder = "Search for restaurants or dishes",
  showSearch = false,
  showLocation = false,
  showBackButton = false,
  onBackClick,
  onLocationClick,
  onSearchAccessClick,
  onSearchSubmit,
  onVoiceSearchClick,
  onQrScanClick,
  cartItemCount,
  onCartClick,
  className,
  restaurantName,
  rating,
  deliveryTime,
}) => {
  console.log("Rendering Header, variant:", variant, "title:", title);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  const commonClasses = "sticky top-0 z-50 bg-background shadow-sm p-3 flex items-center justify-between gap-2";

  if (variant === 'restaurantDetail') {
    return (
      <header className={cn(commonClasses, className)}>
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBackClick} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold truncate">{restaurantName}</h1>
            {rating && deliveryTime && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">⭐ {rating}</Badge>
                    <span>{deliveryTime}</span>
                </div>
            )}
          </div>
        </div>
        {onCartClick && (
            <Button variant="ghost" size="icon" onClick={onCartClick} aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount !== undefined && cartItemCount > 0 && (
                    <Badge variant="destructive" className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs">
                        {cartItemCount}
                    </Badge>
                )}
            </Button>
        )}
      </header>
    );
  }


  return (
    <header className={cn(commonClasses, className)}>
      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={onBackClick} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      {title && !showSearch && (
        <h1 className="text-lg font-semibold truncate flex-1">{title}</h1>
      )}

      {showLocation && location && (
        <Button variant="ghost" onClick={onLocationClick} className="flex items-center gap-1 text-left p-0 h-auto">
          <MapPin className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Deliver to</span>
            <span className="text-sm font-medium truncate max-w-[150px]">{location}</span>
          </div>
        </Button>
      )}
      
      {showSearch && (
        <form onSubmit={handleSearchFormSubmit} className="flex-1 flex items-center gap-2">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="flex-1"
            value={searchTerm}
            onChange={handleSearchInputChange}
            aria-label="Search"
          />
          {variant === 'searchFocus' && onVoiceSearchClick && (
            <Button type="button" variant="ghost" size="icon" onClick={onVoiceSearchClick} aria-label="Voice search">
              <Mic className="h-5 w-5" />
            </Button>
          )}
           {variant === 'searchFocus' && onQrScanClick && (
            <Button type="button" variant="ghost" size="icon" onClick={onQrScanClick} aria-label="Scan QR code">
              <QrCode className="h-5 w-5" />
            </Button>
          )}
        </form>
      )}

      {!showSearch && onSearchAccessClick && (
         <Button variant="ghost" size="icon" onClick={onSearchAccessClick} aria-label="Open search">
            <Search className="h-5 w-5" />
        </Button>
      )}
      
      {onCartClick && variant !== 'restaurantDetail' && (
         <Button variant="ghost" size="icon" onClick={onCartClick} aria-label="Cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount !== undefined && cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs">
                    {cartItemCount}
                </Badge>
            )}
        </Button>
      )}
    </header>
  );
};
export default Header;