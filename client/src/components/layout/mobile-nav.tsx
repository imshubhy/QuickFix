import { useLocation } from "wouter";

export function MobileNav() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
      <div className="flex justify-around py-2">
        <div 
          onClick={() => handleNavigate('/')}
          className={`flex flex-col items-center p-2 cursor-pointer ${isActive('/') ? 'text-[#FF6B6B]' : 'text-gray-500'}`}
        >
          <i className="ri-home-5-line text-xl"></i>
          <span className="text-xs mt-1">Home</span>
        </div>
        
        <div 
          onClick={() => handleNavigate('/services')}
          className={`flex flex-col items-center p-2 cursor-pointer ${isActive('/services') ? 'text-[#FF6B6B]' : 'text-gray-500'}`}
        >
          <i className="ri-search-line text-xl"></i>
          <span className="text-xs mt-1">Services</span>
        </div>
        
        <div 
          onClick={() => handleNavigate('/bookings')}
          className={`flex flex-col items-center p-2 cursor-pointer ${isActive('/bookings') ? 'text-[#FF6B6B]' : 'text-gray-500'}`}
        >
          <i className="ri-calendar-line text-xl"></i>
          <span className="text-xs mt-1">Bookings</span>
        </div>
        
        <div 
          onClick={() => handleNavigate('/login')}
          className={`flex flex-col items-center p-2 cursor-pointer ${isActive('/login') ? 'text-[#FF6B6B]' : 'text-gray-500'}`}
        >
          <i className="ri-user-line text-xl"></i>
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div>
    </div>
  );
}
