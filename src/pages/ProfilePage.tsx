import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, CreditCard, Settings, HelpCircle, LogOut, Edit3, ChevronRight } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    avatarUrl: 'https://source.unsplash.com/random/150x150/?portrait,user',
  });

  useEffect(() => {
    console.log('ProfilePage loaded');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    setIsEditing(false);
    // Here you would typically call an API to save the profile
  };

  const handleLogout = () => {
    alert('Logout successful!');
    // Clear user session, navigate to login page
    navigate('/login'); // Assuming a login page route
  };

  const profileLinks = [
    { label: 'My Addresses', icon: MapPin, action: () => alert('Navigate to My Addresses') },
    { label: 'Payment Methods', icon: CreditCard, action: () => alert('Navigate to Payment Methods') },
    { label: 'Order History', icon: User, action: () => navigate('/orders') }, // Links to OrdersPage
    { label: 'Settings', icon: Settings, action: () => alert('Navigate to Settings') },
    { label: 'Help & Support', icon: HelpCircle, action: () => alert('Navigate to Help & Support') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="pageTitle" title="Profile" />
      <main className="flex-grow p-4 space-y-6 pb-20"> {/* pb-20 for BottomTabBar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            {!isEditing && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-5 w-5" />
                </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleInputChange} />
                </div>
                 <div>
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input id="avatarUrl" name="avatarUrl" value={profile.avatarUrl} onChange={handleInputChange} />
                </div>
                <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="mt-4 text-sm">
                <p><strong>Phone:</strong> {profile.phone}</p>
                {/* Add other non-editable info if any */}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Account Options</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ul className="divide-y divide-border">
                    {profileLinks.map(link => (
                        <li key={link.label}>
                            <Button
                                variant="ghost"
                                className="w-full justify-between px-4 py-3 h-auto text-left"
                                onClick={link.action}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className="h-5 w-5 text-muted-foreground" />
                                    <span>{link.label}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        
        <Separator />

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </main>
      <BottomTabBar />
    </div>
  );
};

export default ProfilePage;