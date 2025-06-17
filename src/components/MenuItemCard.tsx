import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PlusCircle, MinusCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // For "Item added" confirmation

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  // Could add dietary tags (vegan, gluten-free etc.) as Badges
  onAddItem: (item: { id: string | number; name: string; price: number }) => void;
  onRemoveItem?: (itemId: string | number) => void; // Optional if quantity managed elsewhere
  quantityInCart?: number; // Optional: to show +/- buttons if item is in cart
  className?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddItem,
  onRemoveItem,
  quantityInCart = 0,
  className,
}) => {
  const { toast } = useToast();
  console.log("Rendering MenuItemCard:", name, "Quantity:", quantityInCart);

  const handleAdd = () => {
    onAddItem({ id, name, price });
    toast({
      title: "Item Added",
      description: `${name} has been added to your cart.`,
    });
  };

  const handleRemove = () => {
    if (onRemoveItem) {
      onRemoveItem(id);
       toast({
        title: "Item Removed",
        description: `${name} quantity updated.`,
        variant: "default"
      });
    }
  };

  return (
    <Card className={cn("w-full flex flex-col overflow-hidden", className)}>
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className="p-3 space-y-1 flex-grow">
        <h4 className="text-sm font-semibold">{name}</h4>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-2 flex items-center justify-between">
        <span className="text-sm font-semibold">${price.toFixed(2)}</span>
        {quantityInCart > 0 && onRemoveItem ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleRemove} aria-label="Decrease quantity">
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-4 text-center">{quantityInCart}</span>
            <Button variant="outline" size="icon" onClick={handleAdd} aria-label="Increase quantity">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={handleAdd} aria-label={`Add ${name} to cart`}>
            Add <PlusCircle className="ml-1.5 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default MenuItemCard;