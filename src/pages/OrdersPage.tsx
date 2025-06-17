import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import OrderSummaryCard, { OrderItem } from '@/components/OrderSummaryCard';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface Order {
  orderId: string;
  restaurantName: string;
  restaurantImageUrl?: string;
  orderDate: string;
  status: 'Active' | 'Past' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  totalAmount: number;
}

const placeholderActiveOrders: Order[] = [
  { orderId: 'ORD123A', restaurantName: 'Gourmet Burger Kitchen', restaurantImageUrl: 'https://source.unsplash.com/random/100x100/?logo,burger', orderDate: '2024-07-28 18:30', status: 'Active', items: [{id: 'b1', name: 'Classic Cheeseburger', quantity: 1, price: 12.99}], totalAmount: 12.99 },
  { orderId: 'ORD456A', restaurantName: 'Sushi World', restaurantImageUrl: 'https://source.unsplash.com/random/100x100/?logo,sushi', orderDate: '2024-07-28 19:00', status: 'Active', items: [{id: 'sushi1', name: 'Salmon Nigiri Set', quantity: 2, price: 15.00}], totalAmount: 30.00 },
];

const placeholderPastOrders: Order[] = [
  { orderId: 'ORD789P', restaurantName: 'Napoli Pizzeria', restaurantImageUrl: 'https://source.unsplash.com/random/100x100/?logo,pizza', orderDate: '2024-07-25 20:00', status: 'Delivered', items: [{id: 'p1', name: 'Margherita Pizza', quantity: 1, price: 18.00}, {id: 'd1', name: 'Cola', quantity: 2, price: 2.50}], totalAmount: 23.00 },
  { orderId: 'ORD012P', restaurantName: 'Veggie Delight', restaurantImageUrl: 'https://source.unsplash.com/random/100x100/?logo,vegetarian', orderDate: '2024-07-20 12:00', status: 'Cancelled', items: [{id: 'v1', name: 'Veggie Wrap', quantity: 1, price: 9.50}], totalAmount: 9.50 },
];

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('OrdersPage loaded');
    setLoading(true);
    // Simulate fetching orders
    setTimeout(() => {
      setActiveOrders(placeholderActiveOrders);
      setPastOrders(placeholderPastOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (orderId: string) => {
    alert(`View details for order: ${orderId}`);
    // navigate(`/order-details/${orderId}`); // Example navigation
  };

  const handleReorder = (orderId: string) => {
    alert(`Reorder items from order: ${orderId}`);
    // Logic to add items from this order to cart and navigate to cart/restaurant
  };

  const renderOrderList = (orders: Order[], tabType: string) => {
    if (loading) {
      return (
        <div className="space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded-md">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      );
    }
    if (orders.length === 0) {
        return <p className="text-center text-muted-foreground p-8">No {tabType.toLowerCase()} orders found.</p>;
    }
    return (
      <ScrollArea className="h-[calc(100vh-250px)]"> {/* Adjust height */}
        <div className="space-y-3 p-2 md:p-4">
          {orders.map((order) => (
            <OrderSummaryCard
              key={order.orderId}
              {...order}
              onViewDetails={handleViewDetails}
              onReorder={handleReorder}
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="pageTitle" title="My Orders" />
      <main className="flex-grow pb-16"> {/* pb-16 for BottomTabBar */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {renderOrderList(activeOrders, "Active")}
          </TabsContent>
          <TabsContent value="past">
            {renderOrderList(pastOrders, "Past")}
          </TabsContent>
        </Tabs>
      </main>
      <BottomTabBar />
    </div>
  );
};

export default OrdersPage;