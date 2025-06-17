import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // For potential actions like "Reorder" or "View Details"
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number; // Price per unit
  imageUrl?: string;
}

interface OrderSummaryCardProps {
  orderId: string;
  restaurantName: string;
  restaurantImageUrl?: string;
  orderDate: string; // Formatted date string
  status: 'Active' | 'Past' | 'Delivered' | 'Cancelled'; // Or more specific statuses
  items: OrderItem[];
  totalAmount: number;
  onViewDetails?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  className?: string;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  orderId,
  restaurantName,
  restaurantImageUrl,
  orderDate,
  status,
  items,
  totalAmount,
  onViewDetails,
  onReorder,
  className,
}) => {
  console.log("Rendering OrderSummaryCard:", orderId, "Status:", status);

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'processing':
        return 'text-blue-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
        {restaurantImageUrl && (
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <AspectRatio ratio={1}>
                <img src={restaurantImageUrl} alt={restaurantName} className="object-cover w-full h-full" />
            </AspectRatio>
          </div>
        )}
        <div className="flex-grow">
          <CardTitle className="text-base">{restaurantName}</CardTitle>
          <CardDescription className="text-xs">Order ID: {orderId}</CardDescription>
          <CardDescription className="text-xs">Date: {orderDate}</CardDescription>
        </div>
        <div className="text-right">
            <p className={`text-sm font-semibold ${getStatusColor()}`}>{status}</p>
            <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Separator className="mb-3" />
        <div className="space-y-1 text-xs text-muted-foreground">
            {items.slice(0, 2).map(item => ( // Show first 2 items as preview
                <div key={item.id} className="flex justify-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            {items.length > 2 && <span>...and {items.length - 2} more item(s)</span>}
        </div>
      </CardContent>
      {(onViewDetails || onReorder) && (
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(orderId)}>
              View Details
            </Button>
          )}
          {onReorder && status !== 'Active' && ( // Typically can't reorder an active order
            <Button variant="default" size="sm" onClick={() => onReorder(orderId)}>
              Reorder
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
export default OrderSummaryCard;