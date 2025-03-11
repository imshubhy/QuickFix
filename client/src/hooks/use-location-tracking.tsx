import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface ProfessionalLocation {
  professionalId: number;
  location: LocationData;
}

export function useLocationTracking() {
  const { user } = useAuth();
  const [professionalLocations, setProfessionalLocations] = useState<Record<number, LocationData>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection for users
  useEffect(() => {
    if (!user) {
      // No user logged in, don't establish connection
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?type=user&userId=${user.id}`;
    
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'professionalLocation') {
          setProfessionalLocations(prev => ({
            ...prev,
            [data.professionalId]: data.data
          }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    // Clean up the WebSocket connection when component unmounts
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user]);

  // Function to get the location of a specific professional
  const getProfessionalLocation = useCallback((professionalId: number): LocationData | null => {
    return professionalLocations[professionalId] || null;
  }, [professionalLocations]);

  return {
    isConnected,
    professionalLocations,
    getProfessionalLocation
  };
}

// Hook for professional to update their location
export function useProfessionalLocationUpdater() {
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'professional') {
      // Only professionals should use this hook
      return;
    }

    // Get professional ID from user (assuming this relationship exists)
    const professionalId = user.id; // This might need adjustment based on your data model

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?type=professional&professionalId=${professionalId}`;
    
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("Professional WebSocket connection established");
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log("Professional WebSocket connection closed");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("Professional WebSocket error:", error);
      setIsConnected(false);
    };

    // Clean up the WebSocket connection when component unmounts
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user]);

  // Function for professional to update their location
  const updateLocation = useCallback((latitude: number, longitude: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not open, cannot send location update");
      return false;
    }

    wsRef.current.send(JSON.stringify({
      type: 'location',
      data: {
        latitude,
        longitude
      }
    }));

    return true;
  }, []);

  // Fallback to API if WebSocket is not available
  const updateLocationViaApi = useCallback(async (professionalId: number, latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/professionals/${professionalId}/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude, longitude })
      });

      return response.ok;
    } catch (error) {
      console.error("Error updating location via API:", error);
      return false;
    }
  }, []);

  return {
    isConnected,
    updateLocation,
    updateLocationViaApi
  };
}