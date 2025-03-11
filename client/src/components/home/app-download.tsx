import { Button } from "@/components/ui/button";

export function AppDownload() {
  return (
    <section className="py-12 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold font-['Inter'] mb-4">Download Our Mobile App</h2>
            <p className="text-lg mb-6">Get even faster service and exclusive mobile offers with our app. Track professionals in real-time and manage your bookings on the go.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center justify-center bg-white text-[#2D3436] px-6 py-3 rounded-lg hover:bg-gray-100">
                <i className="ri-google-play-fill text-2xl mr-2"></i>
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="font-medium">Google Play</p>
                </div>
              </Button>
              
              <Button className="flex items-center justify-center bg-white text-[#2D3436] px-6 py-3 rounded-lg hover:bg-gray-100">
                <i className="ri-apple-fill text-2xl mr-2"></i>
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="font-medium">App Store</p>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="md:w-5/12">
            <svg 
              viewBox="0 0 600 400" 
              className="rounded-lg shadow-lg w-full"
            >
              <rect width="600" height="400" fill="#DDD" rx="8" />
              <text x="300" y="200" textAnchor="middle" fill="#999" fontFamily="Inter, sans-serif" fontSize="16">
                Mobile App Image
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
