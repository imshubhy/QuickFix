import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { type Booking } from "@shared/schema";

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

function getStatusColor(status: string): string {
  switch(status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function Bookings() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: [`/api/users/${user?.id}/bookings`],
    enabled: !!user,
  });
  
  // Filter bookings by status
  const upcomingBookings = bookings?.filter(booking => 
    ['pending', 'confirmed'].includes(booking.status)
  ) || [];
  
  const activeBookings = bookings?.filter(booking =>
    booking.status === 'in_progress'
  ) || [];
  
  const pastBookings = bookings?.filter(booking =>
    ['completed', 'cancelled'].includes(booking.status)
  ) || [];
  
  if (!user) {
    return null; // Redirect handled in useEffect
  }
  
  return (
    <div className="font-['Nunito_Sans'] text-[#2D3436] bg-[#F8F9FA] min-h-screen">
      <Header />
      
      <main className="pt-24 pb-20 md:pb-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-['Inter']">My Bookings</h1>
            <Button className="bg-[#FF6B6B] hover:bg-opacity-90" onClick={() => navigate('/services')}>
              Book New Service
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-3">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-60" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-10 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">📅</div>
                  <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                  <p className="text-gray-500 mb-6">You don't have any scheduled service appointments.</p>
                  <Button className="bg-[#FF6B6B] hover:bg-opacity-90" onClick={() => navigate('/services')}>
                    Book a Service
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>{booking.serviceType}</CardTitle>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>{formatDate(booking.scheduledFor || booking.createdAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p><strong>Address:</strong> {booking.address}</p>
                          {booking.instructions && <p><strong>Instructions:</strong> {booking.instructions}</p>}
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">${booking.totalCost.toFixed(2)}</p>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">
                                Contact
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {isLoading ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-60" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : activeBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">👨‍🔧</div>
                  <h3 className="text-xl font-medium mb-2">No active services</h3>
                  <p className="text-gray-500">You don't have any services in progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>{booking.serviceType}</CardTitle>
                          <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
                        </div>
                        <CardDescription>Started at {formatDate(booking.scheduledFor || booking.createdAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p><strong>Address:</strong> {booking.address}</p>
                          {booking.instructions && <p><strong>Instructions:</strong> {booking.instructions}</p>}
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">${booking.totalCost.toFixed(2)}</p>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">
                                Contact
                              </Button>
                              <Button 
                                className="bg-[#4ECDC4] hover:bg-opacity-90" 
                                size="sm"
                                onClick={() => navigate(`/tracking?id=${booking.professionalId}`)}
                              >
                                Track Location
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-3">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-60" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-10 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pastBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium mb-2">No past bookings</h3>
                  <p className="text-gray-500">Your booking history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>{booking.serviceType}</CardTitle>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>{formatDate(booking.scheduledFor || booking.createdAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p><strong>Address:</strong> {booking.address}</p>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">${booking.totalCost.toFixed(2)}</p>
                            {booking.status === 'completed' && (
                              <Button className="bg-[#4ECDC4] hover:bg-opacity-90" size="sm">
                                Leave Review
                              </Button>
                            )}
                            {booking.status === 'cancelled' && (
                              <Button className="bg-[#FF6B6B] hover:bg-opacity-90" size="sm">
                                Book Again
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
