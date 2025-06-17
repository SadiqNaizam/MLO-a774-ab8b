import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock3, Tag } from 'lucide-react'; // Icons for rating, time, offers
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  rating: number; // e.g., 4.5
  reviewCount?: number; // e.g., 100+
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  deliveryTimeEstimate: string; // e.g., "25-35 min"
  deliveryFee?: string; // e.g., "$2.99" or "Free"
  offer?: string; // e.g., "20% OFF"
  onClick: (id: string | number) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  reviewCount,
  cuisineTypes,
  deliveryTimeEstimate,
  deliveryFee,
  offer,
  onClick,
  className,
}) => {
  console.log("Rendering RestaurantCard:", name);
  return (
    <Card
      className={cn("w-full overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200", className)}
      onClick={() => onClick(id)}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        {offer && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 flex items-center gap-1"
          >
            <Tag className="h-3 w-3" /> {offer}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        <h3 className="text-base font-semibold truncate">{name}</h3>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span>{rating.toFixed(1)}</span>
          {reviewCount && <span>({reviewCount > 99 ? '99+' : reviewCount} reviews)</span>}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {cuisineTypes.join(', ')}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t mt-2">
         <div className="flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            <span>{deliveryTimeEstimate}</span>
         </div>
         {deliveryFee && (
            <span className={deliveryFee.toLowerCase() === 'free' ? 'text-green-600 font-medium' : ''}>
                {deliveryFee}
            </span>
         )}
      </CardFooter>
    </Card>
  );
};
export default RestaurantCard;