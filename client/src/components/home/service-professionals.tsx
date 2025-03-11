import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type ServiceProfessionalWithDetails } from "@shared/schema";
import { Stars } from "@/components/ui/stars";
import { TimeBadge } from "@/components/ui/time-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/context/booking-context";

export function ServiceProfessionals() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortType, setSortType] = useState<string>("rating");
  
  const { data: professionals, isLoading } = useQuery<ServiceProfessionalWithDetails[]>({
    queryKey: ['/api/professionals'],
  });
  
  const { openBookingModal } = useBooking();
  
  // Apply filters and sorting
  const filteredProfessionals = professionals?.filter(pro => {
    if (categoryFilter === "all") return true;
    return pro.category.id.toString() === categoryFilter;
  }) || [];
  
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortType === "rating") return (b.avgRating || 0) - (a.avgRating || 0);
    if (sortType === "price") return a.hourlyRate - b.hourlyRate;
    return (a.distance || 0) - (b.distance || 0);
  });
  
  const handleBookNow = (professional: ServiceProfessionalWithDetails) => {
    openBookingModal(professional);
  };
  
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold font-['Inter']">Popular Service Professionals</h2>
            <p className="text-gray-600">Top-rated professionals in your area</p>
          </div>
          
          <div className="hidden md:flex space-x-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="1">Plumbing</SelectItem>
                <SelectItem value="2">Electrical</SelectItem>
                <SelectItem value="3">Carpentry</SelectItem>
                <SelectItem value="4">Painting</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortType} onValueChange={setSortType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by: Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Sort by: Rating</SelectItem>
                <SelectItem value="price">Sort by: Price</SelectItem>
                <SelectItem value="distance">Sort by: Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filter section for mobile */}
        <div className="md:hidden mb-6 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          <Button 
            variant={categoryFilter === "all" ? "default" : "outline"} 
            className={categoryFilter === "all" ? "bg-[#FF6B6B]" : ""} 
            onClick={() => setCategoryFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={categoryFilter === "1" ? "default" : "outline"} 
            className={categoryFilter === "1" ? "bg-[#FF6B6B]" : ""} 
            onClick={() => setCategoryFilter("1")}
            size="sm"
          >
            Plumbing
          </Button>
          <Button 
            variant={categoryFilter === "2" ? "default" : "outline"} 
            className={categoryFilter === "2" ? "bg-[#FF6B6B]" : ""} 
            onClick={() => setCategoryFilter("2")}
            size="sm"
          >
            Electrical
          </Button>
          <Button 
            variant={categoryFilter === "3" ? "default" : "outline"} 
            className={categoryFilter === "3" ? "bg-[#FF6B6B]" : ""} 
            onClick={() => setCategoryFilter("3")}
            size="sm"
          >
            Carpentry
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex items-start">
                    <Skeleton className="w-16 h-16 rounded-full mr-4" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            sortedProfessionals.map((professional) => (
              <div key={professional.id} className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
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
                        <span>{professional.distance} miles away</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="ri-time-line text-gray-500 mr-1"></i>
                        <span>
                          {professional.isAvailable 
                            ? `Arrives in ~${Math.floor(professional.distance * 10)} min` 
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
                      className="text-[#4ECDC4] font-medium bg-transparent border-none cursor-pointer p-0"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button className="px-6 py-3 border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors">
            View More Professionals
          </Button>
        </div>
      </div>
    </section>
  );
}
