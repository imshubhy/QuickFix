import { createContext, useContext, useState, ReactNode } from "react";
import { type ServiceProfessionalWithDetails } from "@shared/schema";

interface BookingContextType {
  isOpen: boolean;
  selectedProfessional: ServiceProfessionalWithDetails | null;
  openBookingModal: (professional: ServiceProfessionalWithDetails) => void;
  closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<ServiceProfessionalWithDetails | null>(null);

  const openBookingModal = (professional: ServiceProfessionalWithDetails) => {
    setSelectedProfessional(professional);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ isOpen, selectedProfessional, openBookingModal, closeBookingModal }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
