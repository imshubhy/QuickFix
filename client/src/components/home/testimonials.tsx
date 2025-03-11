import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emily Rodriguez",
    rating: 5,
    comment: "The plumber arrived in just 8 minutes after booking! Fixed my leaking sink quickly and professionally. Will definitely use QuickFix again!",
    date: "2 days ago",
    service: "Plumbing Service"
  },
  {
    id: 2,
    name: "Michael Thompson",
    rating: 4.5,
    comment: "Sarah was amazing at fixing our electrical issues. She was prompt, knowledgeable, and even gave us tips to prevent future problems. Highly recommend!",
    date: "1 week ago",
    service: "Electrical Service"
  },
  {
    id: 3,
    name: "Priya Patel",
    rating: 4,
    comment: "Marcus helped assemble my furniture quickly and carefully. The app's tracking feature was great as I could see exactly when he'd arrive. Payment was smooth too!",
    date: "3 days ago",
    service: "Carpentry Service"
  }
];

export function Testimonials() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateSlideWidth = () => {
      if (window.innerWidth >= 1024) {
        setSlideWidth(33.333);
      } else if (window.innerWidth >= 768) {
        setSlideWidth(50);
      } else {
        setSlideWidth(100);
      }
    };
    
    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    
    return () => {
      window.removeEventListener("resize", updateSlideWidth);
    };
  }, []);
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold font-['Inter']">Happy Customers</h2>
            <p className="text-gray-600">What people are saying about our service</p>
          </div>
          
          <div className="hidden md:flex space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={prevSlide}
            >
              <i className="ri-arrow-left-s-line"></i>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={nextSlide}
            >
              <i className="ri-arrow-right-s-line"></i>
            </Button>
          </div>
        </div>
        
        <div ref={containerRef} className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${activeSlide * slideWidth}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className={`min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-3`}
              >
                <div className="bg-[#F8F9FA] rounded-xl p-6 shadow-sm h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <i className="ri-user-fill text-2xl text-gray-400"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <Stars rating={testimonial.rating} className="text-sm" />
                    </div>
                  </div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                  <p className="mt-4 text-sm text-gray-500">{testimonial.date} · {testimonial.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center md:hidden">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={prevSlide}
            >
              <i className="ri-arrow-left-s-line"></i>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-full"
              onClick={nextSlide}
            >
              <i className="ri-arrow-right-s-line"></i>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
