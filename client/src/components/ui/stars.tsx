import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarsProps {
  rating: number;
  className?: string;
}

export function Stars({ rating, className = "" }: StarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={`flex items-center text-amber-400 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <FaStar key={`full-${i}`} className="w-4 h-4" />
      ))}
      
      {hasHalfStar && <FaStarHalfAlt className="w-4 h-4" />}
      
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-4 h-4" />
      ))}
    </div>
  );
}
