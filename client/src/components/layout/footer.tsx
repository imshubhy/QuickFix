import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#2D3436] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-['Inter']">QuickFix</h3>
            <p className="mb-4">Professional home services at your doorstep within minutes.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#4ECDC4]">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-[#4ECDC4]">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-[#4ECDC4]">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-[#4ECDC4]">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => window.location.href = "/"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Home</button></li>
              <li><button className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">About Us</button></li>
              <li><button onClick={() => window.location.href = "/services"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Services</button></li>
              <li><button className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Professional Login</button></li>
              <li><button className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Join as Professional</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><button onClick={() => window.location.href = "/services/1"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Plumbing</button></li>
              <li><button onClick={() => window.location.href = "/services/2"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Electrical</button></li>
              <li><button onClick={() => window.location.href = "/services/3"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Carpentry</button></li>
              <li><button onClick={() => window.location.href = "/services/4"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Painting</button></li>
              <li><button onClick={() => window.location.href = "/services/5"} className="hover:text-[#4ECDC4] bg-transparent border-none cursor-pointer text-white p-0">Appliance Repair</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="ri-map-pin-line mt-1 mr-2"></i>
                <span>123 Main Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <i className="ri-phone-line mr-2"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="ri-mail-line mr-2"></i>
                <span>support@quickfix.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} QuickFix. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-[#4ECDC4]">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-[#4ECDC4]">Terms of Service</a>
            <a href="#" className="text-sm hover:text-[#4ECDC4]">Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
