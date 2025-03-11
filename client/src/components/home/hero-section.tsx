import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [location, setLocation] = useState("");
  const [_, navigate] = useLocation();
  
  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/services");
  };
  
  return (
    <section className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Inter'] mb-4">Professional Services at Your Doorstep</h2>
            <p className="text-lg mb-6 max-w-lg">Get plumbers, electricians, carpenters and other professionals within 10 minutes. Quick, reliable, and hassle-free.</p>
            
            <form onSubmit={handleLocationSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <i className="ri-map-pin-line absolute left-3 top-3 text-gray-400"></i>
                <Input 
                  type="text" 
                  placeholder="Enter your location" 
                  className="pl-10 pr-4 py-3 rounded-lg w-full text-[#2D3436]"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="px-6 py-3 bg-white text-[#FF6B6B] font-semibold rounded-lg hover:bg-gray-100"
              >
                Find Services
              </Button>
            </form>
            
            <div className="flex items-center space-x-4 flex-wrap">
              <div className="flex items-center">
                <i className="ri-time-line mr-2"></i>
                <span>10-min response</span>
              </div>
              <div className="flex items-center">
                <i className="ri-shield-check-line mr-2"></i>
                <span>Verified Pros</span>
              </div>
              <div className="flex items-center">
                <i className="ri-secure-payment-line mr-2"></i>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-5/12 relative">
            <svg 
              viewBox="0 0 600 400" 
              className="rounded-lg shadow-lg w-full"
            >
              <rect width="600" height="400" fill="#DDD" rx="8" />
              <text x="300" y="200" textAnchor="middle" fill="#999" fontFamily="Inter, sans-serif" fontSize="16">
                Service Professional Image
              </text>
            </svg>
            
            <div className="absolute -bottom-4 -left-4 bg-white text-[#2D3436] p-3 rounded-lg shadow-md flex items-center">
              <div className="bg-[#2ECC71] text-white rounded-full p-2 mr-3">
                <i className="ri-timer-line"></i>
              </div>
              <div>
                <p className="font-medium">Professionals nearby</p>
                <p className="text-sm text-gray-500">Arrives in ~8 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
