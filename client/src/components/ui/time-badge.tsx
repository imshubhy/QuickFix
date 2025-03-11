import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const timeBadgeVariants = cva(
  "flex items-center px-2 py-1 rounded-lg text-xs font-medium",
  {
    variants: {
      variant: {
        available: "bg-[#2ECC71] text-white",
        busy: "bg-gray-200 text-gray-700",
      }
    },
    defaultVariants: {
      variant: "available"
    }
  }
);

interface TimeBadgeProps extends VariantProps<typeof timeBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function TimeBadge({ 
  children, 
  variant,
  className
}: TimeBadgeProps) {
  return (
    <div className={cn(timeBadgeVariants({ variant }), className)}>
      <i className="ri-time-line mr-1"></i>
      <span>{children}</span>
    </div>
  );
}
