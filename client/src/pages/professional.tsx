import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Stars } from "@/components/ui/stars";
import { TimeBadge } from "@/components/ui/time-badge";
import { useBooking } from "@/context/booking-context";
import { type ServiceProfessionalWithDetails, type Review } from "@shared/schema";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export default function Professional() {
  const params = useParams();
  const [_, navigate] = useLocation();
  const { openBookingModal } = useBooking();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Extract professional ID from URL query parameters
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id && !isNaN(parseInt(id))) {
      setProfessionalId(parseInt(id));
    }
  }, []);
  
  const { data: professional, isLoading: isLoadingProfessional } = useQuery<ServiceProfessionalWithDetails>({
    queryKey: ['/api/professionals', professionalId],
    enabled: professionalId !== null,
  });
  
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ['/api/professionals', professionalId, 'reviews'],
    enabled: professionalId !== null,
  });
  
  useEffect(() => {
    if (professionalId === null) {
      navigate("/services");
    }
  }, [professionalId, navigate]);
  
  if (professionalId === null) {
    return null; // Redirect handled in useEffect
  }
  
  const handleBookNow = () => {
    if (professional) {
      openBookingModal(professional);
    }
  };
  
  return (
    <div className="font-['Nunito_Sans'] text-[#2D3436] bg-[#F8F9FA] min-h-screen">
      <Header />
      
      <main className="pt-20 pb-20 md:pb-10">
        <div className="container mx-auto px-4">
          {isLoadingProfessional ? (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-32 mb-4" />
                  <div className="md:flex md:justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-5 w-40 mb-4" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ) : professional ? (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden">
                  <i className="ri-user-fill text-6xl text-gray-400"></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h1 className="text-2xl font-bold font-['Inter'] mb-1">{professional.user.fullName}</h1>
                      <p className="text-gray-600 mb-2">{professional.title}</p>
                      <div className="flex items-center mb-3">
                        <Stars rating={professional.avgRating || 0} />
                        <span className="ml-2 text-sm text-gray-600">
                          {professional.avgRating?.toFixed(1)} ({professional.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4 md:mb-0">
                      <TimeBadge variant={professional.isAvailable ? "available" : "busy"} className="mb-2">
                        {professional.isAvailable ? "Available Now" : "Busy until 2PM"}
                      </TimeBadge>
                      
                      <div className="flex flex-col space-y-2">
                        <Button 
                          onClick={handleBookNow}
                          disabled={!professional.isAvailable}
                          className={professional.isAvailable ? "w-full bg-[#FF6B6B] hover:bg-opacity-90" : "w-full"}
                          variant={professional.isAvailable ? "default" : "outline"}
                        >
                          {professional.isAvailable ? "Book Now" : "Schedule for Later"}
                        </Button>
                        
                        <Button 
                          onClick={() => navigate(`/tracking?id=${professionalId}`)}
                          variant="outline" 
                          className="w-full border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                        >
                          <i className="ri-map-pin-line mr-1"></i> Track Location
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#F8F9FA] p-4 rounded-lg flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm text-gray-500">Service Rate</p>
                      <p className="font-semibold">${professional.hourlyRate}/hr</p>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold">{professional.distance} miles away</p>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm text-gray-500">Estimated Arrival</p>
                      <p className="font-semibold">
                        {professional.isAvailable 
                          ? `~ ${Math.floor(professional.distance * 10)} minutes` 
                          : 'Available after 2PM'}
                      </p>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold">{professional.category.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Professional not found</h2>
              <p className="text-gray-600 mb-6">The professional you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/services")}>Back to Services</Button>
            </div>
          )}
          
          {professional && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 font-['Inter']">About</h2>
                  <p className="mb-6">
                    {professional.description || `${professional.user.fullName} is a professional ${professional.title.toLowerCase()} with experience in various ${professional.category.name.toLowerCase()} tasks. They specialize in ${professional.skills}.`}
                  </p>
                  
                  <h2 className="text-xl font-semibold mb-4 font-['Inter']">Specializations</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {professional.skills.split(', ').map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-[#4ECDC4] bg-opacity-10 text-[#4ECDC4] rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4 font-['Inter']">Contact Information</h2>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {professional.user.email}</p>
                    {professional.user.phone && <p><strong>Phone:</strong> {professional.user.phone}</p>}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold font-['Inter']">Customer Reviews</h2>
                    <div className="flex items-center">
                      <Stars rating={professional.avgRating || 0} className="mr-2" />
                      <span className="font-semibold">{professional.avgRating?.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({professional.totalReviews} reviews)</span>
                    </div>
                  </div>
                  
                  {isLoadingReviews ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-6 mb-6 last:border-0">
                          <div className="flex items-start mb-3">
                            <Skeleton className="w-10 h-10 rounded-full mr-3" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : reviews?.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No reviews yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews?.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <i className="ri-user-fill text-gray-400"></i>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium mr-2">Customer</p>
                                <Stars rating={review.rating} className="text-xs" />
                              </div>
                              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="services">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6 font-['Inter']">Services Offered</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {professional.skills.split(', ').map((skill, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B6B] bg-opacity-10 flex items-center justify-center mr-3">
                              <i className={`${professional.category.icon} text-[#FF6B6B]`}></i>
                            </div>
                            <h3 className="font-semibold">{skill}</h3>
                          </div>
                          <p className="text-gray-600 mb-4">Professional {professional.category.name.toLowerCase()} service with attention to detail and quality workmanship.</p>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">${professional.hourlyRate}/hr</p>
                            <Button 
                              onClick={handleBookNow}
                              disabled={!professional.isAvailable}
                              className={professional.isAvailable ? "bg-[#FF6B6B] hover:bg-opacity-90" : ""}
                              variant={professional.isAvailable ? "default" : "outline"}
                              size="sm"
                            >
                              {professional.isAvailable ? "Book Now" : "Schedule"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
