import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type ServiceCategory } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCategories() {
  const { data: categories, isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/categories'],
  });
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold font-['Inter']">What service do you need?</h2>
            <p className="text-gray-600">Browse through our popular service categories</p>
          </div>
          <button 
            onClick={() => window.location.href = "/services"}
            className="hidden md:flex items-center text-[#4ECDC4] font-medium bg-transparent border-none cursor-pointer"
          >
            See all categories
            <i className="ri-arrow-right-line ml-1"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            // Skeleton loading state
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full mb-3" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          ) : (
            categories?.map((category) => (
              <div 
                key={category.id}
                onClick={() => window.location.href = `/services/${category.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col items-center cursor-pointer"
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-opacity-10 mb-3`}
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <i className={`${category.icon} text-2xl`} style={{ color: category.color }}></i>
                </div>
                <h3 className="text-center font-medium">{category.name}</h3>
                <p className="text-xs text-gray-500 text-center">Starting at ${category.startingPrice}</p>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 flex justify-center md:hidden">
          <button 
            onClick={() => window.location.href = "/services"}
            className="flex items-center text-[#4ECDC4] font-medium bg-transparent border-none cursor-pointer"
          >
            See all categories
            <i className="ri-arrow-right-line ml-1"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
