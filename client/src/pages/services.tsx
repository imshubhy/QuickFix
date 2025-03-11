import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Stars } from "@/components/ui/stars";
import { TimeBadge } from "@/components/ui/time-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingModal } from "@/components/booking/booking-modal";
import { useBooking } from "@/context/booking-context";
import { 
  type ServiceCategory,
  type ServiceProfessionalWithDetails
} from "@shared/schema";

export default function Services() {
  const params = useParams();
  const categoryId = params?.categoryId;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState("all");
  const [availability, setAvailability] = useState("all");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: professionals, isLoading: professionalsLoading } = useQuery<ServiceProfessionalWithDetails[]>({
    queryKey: ['/api/professionals', categoryId || 'all'],
    queryFn: async () => {
      const url = categoryId 
        ? `/api/professionals?categoryId=${categoryId}` 
        : '/api/professionals';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch professionals');
      return res.json();
    }
  });
  
  const { openBookingModal } = useBooking();
  
  const activeCategory = categories?.find(c => c.id.toString() === categoryId);
  
  // Filter and sort professionals
  const filteredProfessionals = professionals?.filter(pro => {
    // Search filter
    if (searchTerm && !pro.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !pro.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (priceRange === 'low' && pro.hourlyRate > 30) return false;
    if (priceRange === 'medium' && (pro.hourlyRate < 30 || pro.hourlyRate > 50)) return false;
    if (priceRange === 'high' && pro.hourlyRate < 50) return false;
    
    // Availability filter
    if (availability === 'available' && !pro.isAvailable) return false;
    
    return true;
  }) || [];
  
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === 'rating') return (b.avgRating || 0) - (a.avgRating || 0);
    if (sortBy === 'price_low') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'price_high') return b.hourlyRate - a.hourlyRate;
    return (a.distance || 0) - (b.distance || 0);
  });
  
  const handleBookNow = (professional: ServiceProfessionalWithDetails) => {
    openBookingModal(professional);
  };
  
  return (
    <div className="font-['Nunito_Sans'] text-[#2D3436] bg-[#F8F9FA] min-h-screen">
      <Header />
      
      <main className="pt-20 pb-20 md:pb-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold font-['Inter'] mb-2">
              {activeCategory ? `${activeCategory.name} Services` : 'All Services'}
            </h1>
            <p className="text-gray-600">
              {activeCategory ? activeCategory.description : 'Find the best service professionals in your area'}
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name or service"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Nearest</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">Budget (Under $30)</SelectItem>
                    <SelectItem value="medium">Mid-Range ($30-$50)</SelectItem>
                    <SelectItem value="high">Premium (Over $50)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professionals</SelectItem>
                    <SelectItem value="available">Available Now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Category Tabs (mobile only) */}
          <div className="md:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              <Button 
                onClick={() => window.location.href = "/services"}
                variant={!categoryId ? "default" : "outline"} 
                size="sm"
                className={!categoryId ? "bg-[#FF6B6B]" : ""}
              >
                All
              </Button>
              
              {categoriesLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-24" />
                ))
              ) : (
                categories?.map(category => (
                  <Button 
                    key={category.id}
                    onClick={() => window.location.href = `/services/${category.id}`}
                    variant={categoryId === category.id.toString() ? "default" : "outline"} 
                    size="sm"
                    className={categoryId === category.id.toString() ? "bg-[#FF6B6B]" : ""}
                  >
                    {category.name}
                  </Button>
                ))
              )}
            </div>
          </div>
          
          {/* Service Professionals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalsLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-start">
                    <Skeleton className="w-16 h-16 rounded-full mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : sortedProfessionals.length === 0 ? (
              <div className="col-span-full py-8 text-center">
                <div className="text-3xl mb-4">😕</div>
                <h3 className="text-xl font-medium mb-2">No professionals found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              sortedProfessionals.map(professional => (
                <div key={professional.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                        <i className="ri-user-fill text-3xl text-gray-400"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{professional.user.fullName}</h3>
                            <p className="text-sm text-gray-500">{professional.title}</p>
                          </div>
                          <TimeBadge variant={professional.isAvailable ? "available" : "busy"}>
                            {professional.isAvailable ? "Available" : "Busy until 2PM"}
                          </TimeBadge>
                        </div>
                        
                        <div className="flex items-center mt-1.5">
                          <Stars rating={professional.avgRating || 0} />
                          <span className="ml-2 text-sm text-gray-600">
                            {professional.avgRating?.toFixed(1)} ({professional.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-sm">
                          <i className="ri-map-pin-line text-gray-500 mr-1"></i>
                          <span>{professional.distance || 0} miles away</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <i className="ri-time-line text-gray-500 mr-1"></i>
                          <span>
                            {professional.isAvailable 
                              ? (professional.distance 
                                 ? `Arrives in ~${Math.floor(professional.distance * 10)} min`
                                 : 'Arrives in ~10 min')
                              : 'Available after 2PM'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-500">Service from</span>
                          <span className="font-semibold"> ${professional.hourlyRate}/hr</span>
                        </div>
                        <Button 
                          onClick={() => handleBookNow(professional)}
                          disabled={!professional.isAvailable}
                          className={professional.isAvailable ? "bg-[#FF6B6B] hover:bg-opacity-90" : ""}
                          variant={professional.isAvailable ? "default" : "outline"}
                          size="sm"
                        >
                          {professional.isAvailable ? "Book Now" : "Schedule"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <i className="ri-tools-line text-gray-500 mr-1"></i>
                        <span>{professional.skills}</span>
                      </div>
                      <button 
                        onClick={() => window.location.href = `/professional/${professional.id}`}
                        className="text-[#4ECDC4] font-medium bg-transparent border-none cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
      <BookingModal />
    </div>
  );
}

// Helper Link component to make wouter work with button children
function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  const [_, navigate] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };
  
  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
