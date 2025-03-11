import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
  };
  
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-[#FF6B6B] font-['Inter']">QuickFix</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">
            Home
          </Link>
          <Link href="/services" className="font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">
            Services
          </Link>
          <a href="#how-it-works" className="font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">How it Works</a>
          <a href="#" className="font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">Support</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/bookings"}
                >
                  My Bookings
                </Button>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/login"}
                >
                  Login
                </Button>
                <Button 
                  className="bg-[#FF6B6B] hover:bg-opacity-90" 
                  onClick={() => window.location.href = "/register"}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
          
          <div className="flex md:hidden">
            <button onClick={toggleMobileMenu} className="p-2">
              <i className="ri-menu-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="py-2 font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">
                Home
              </Link>
              <Link href="/services" className="py-2 font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">
                Services
              </Link>
              <a href="#how-it-works" className="py-2 font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">How it Works</a>
              <a href="#" className="py-2 font-['Inter'] font-medium text-[#2D3436] hover:text-[#FF6B6B]">Support</a>
              
              <div className="flex pt-2 gap-3">
                {user ? (
                  <>
                    <Button 
                      className="flex-1" 
                      variant="outline" 
                      onClick={() => window.location.href = "/bookings"}
                    >
                      My Bookings
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={handleLogout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="flex-1" 
                      variant="outline" 
                      onClick={() => window.location.href = "/login"}
                    >
                      Login
                    </Button>
                    <Button 
                      className="flex-1 bg-[#FF6B6B] hover:bg-opacity-90" 
                      onClick={() => window.location.href = "/register"}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
