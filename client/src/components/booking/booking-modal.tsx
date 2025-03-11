import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBooking } from "@/context/booking-context";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type ServiceProfessionalWithDetails, type InsertBooking } from "@shared/schema";

export function BookingModal() {
  const { isOpen, closeBookingModal, selectedProfessional } = useBooking();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("asap");
  const [address, setAddress] = useState(user?.address || "");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!selectedProfessional) return null;
  
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a service",
        variant: "destructive"
      });
      return;
    }
    
    if (!serviceType || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const professional = selectedProfessional as ServiceProfessionalWithDetails;
      const estimatedArrival = Math.floor((professional.distance || 1) * 10);
      
      const scheduledFor = time === "asap" ? new Date() : new Date(`${date}T${time}`);
      
      const bookingData: InsertBooking = {
        userId: user.id,
        professionalId: professional.id,
        serviceType,
        address,
        instructions,
        status: "pending",
        scheduledFor,
        estimatedArrival,
        totalCost: professional.hourlyRate + 5 // Base hourly rate + $5 travel fee
      };
      
      await apiRequest("POST", "/api/bookings", bookingData);
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/bookings`] });
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking with ${professional.user.fullName} has been confirmed.`
      });
      
      closeBookingModal();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const professional = selectedProfessional as ServiceProfessionalWithDetails;
  const serviceCost = professional.hourlyRate;
  const travelFee = 5;
  const totalCost = serviceCost + travelFee;
  const estimatedArrival = Math.floor((professional.distance || 1) * 10);
  
  return (
    <Dialog open={isOpen} onOpenChange={closeBookingModal}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-['Inter']">Book a Service</DialogTitle>
          <DialogDescription>
            Fill in the details below to book your service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <i className="ri-user-fill text-2xl text-gray-400"></i>
            </div>
            <div>
              <h4 className="font-semibold">{professional.user.fullName}</h4>
              <p className="text-sm text-gray-500">{professional.title}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="service-type">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {professional.skills.split(', ').map((skill, index) => (
                  <SelectItem key={index} value={skill}>{skill}</SelectItem>
                ))}
                <SelectItem value="Other">Other (Please specify)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Date & Time</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">As soon as possible</SelectItem>
                    <SelectItem value="09:00">9:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM - 11:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00">12:00 PM - 1:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM - 2:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM - 3:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {time === "asap" && (
              <div className="mt-2 flex items-center text-sm text-[#2ECC71]">
                <i className="ri-time-line mr-1"></i>
                <span>Pro can arrive in approximately {estimatedArrival} minutes</span>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              placeholder="Enter your address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="instructions">Additional Instructions (optional)</Label>
            <Textarea 
              id="instructions" 
              placeholder="Provide any additional details or instructions" 
              className="h-20"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          
          <div className="bg-[#F8F9FA] p-3 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Service Fee</span>
              <span className="font-medium">${serviceCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Travel Fee</span>
              <span className="font-medium">${travelFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Total (estimated)</span>
              <span className="font-bold">${totalCost.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Final price may vary based on service duration</p>
          </div>
          
          <div>
            <Label>Payment Method</Label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <i className="ri-bank-card-line mr-2"></i>
              <span>Pay when service is complete</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col gap-2">
          <Button 
            className="w-full py-3 bg-[#FF6B6B] hover:bg-opacity-90" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
          <p className="text-xs text-center text-gray-500">
            By confirming, you agree to our <a href="#" className="text-[#4ECDC4]">Terms of Service</a> and <a href="#" className="text-[#4ECDC4]">Cancellation Policy</a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
