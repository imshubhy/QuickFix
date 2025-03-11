import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { LocationTracker } from "@/components/tracking/location-tracker";
import { LocationUpdater } from "@/components/tracking/location-updater";
import { useAuth } from "@/context/auth-context";
import { ServiceProfessionalWithDetails, User } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function Tracking() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  
  // Extract professional ID from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id && !isNaN(parseInt(id))) {
      setProfessionalId(parseInt(id));
    }
  }, []);
  
  // Fetch professional details
  const { data: professional, isLoading } = useQuery<ServiceProfessionalWithDetails>({
    queryKey: ['/api/professionals', professionalId],
    enabled: professionalId !== null,
  });

  // Fetch user details if professional exists
  const { data: professionalUser, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['/api/users', professional?.userId],
    enabled: professional?.userId !== undefined,
  });
  
  // Determine if current user is the professional
  const isProfessional = user?.id === professional?.userId;
  
  // Handle back button click
  const handleBack = () => {
    if (professionalId) {
      setLocation(`/professional?id=${professionalId}`);
    } else {
      setLocation('/bookings');
    }
  };
  
  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  if (!professional) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Professional Not Found</h1>
        <p className="mb-6">The professional you're trying to track couldn't be found.</p>
        <Button onClick={() => setLocation('/bookings')}>Go to Bookings</Button>
      </div>
    );
  }
  
  return (
    <div className="font-['Nunito_Sans'] text-[#2D3436] bg-[#F8F9FA] min-h-screen">
      <Header />
      
      <main className="pt-24 pb-20 md:pb-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <MapPin className="mr-2 h-6 w-6 text-primary" />
            Location Tracking
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isProfessional 
              ? "Share your real-time location with clients during service delivery."
              : `Track the location of ${professionalUser?.fullName || 'your professional'} in real-time.`
            }
          </p>
          
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {/* For users: show the professional's location */}
            {!isProfessional && (
              <div className="col-span-1">
                <LocationTracker 
                  professionalId={professional.id}
                  professionalName={professionalUser?.fullName || 'Professional'}
                />
              </div>
            )}
            
            {/* For professionals: show the location updater */}
            {isProfessional && (
              <div className="col-span-1">
                <LocationUpdater professionalId={professional.id} />
              </div>
            )}
            
            {/* Information section */}
            <div className="col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="font-semibold text-xl mb-4">About Location Tracking</h2>
                
                {isProfessional ? (
                  <>
                    <p className="mb-4">
                      By enabling location sharing, you allow clients with active bookings to see your real-time location as you travel to their service location.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Privacy First</h3>
                          <p className="text-sm text-gray-600">Your location is only shared with clients who have active bookings with you.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Battery Usage</h3>
                          <p className="text-sm text-gray-600">Continuous location tracking may reduce battery life. Consider disabling when not needed.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-4">
                      You can now track your professional's location in real-time as they travel to your service location.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Accurate ETA</h3>
                          <p className="text-sm text-gray-600">See exactly where your professional is and when they'll arrive.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Real-Time Updates</h3>
                          <p className="text-sm text-gray-600">Location updates automatically as your professional travels.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}