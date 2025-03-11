import { useState, useEffect, useCallback } from 'react';
import { useProfessionalLocationUpdater } from '@/hooks/use-location-tracking';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Navigation, MapPin, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationUpdaterProps {
  professionalId: number;
}

export function LocationUpdater({ professionalId }: LocationUpdaterProps) {
  const { user } = useAuth();
  const { isConnected, updateLocation, updateLocationViaApi } = useProfessionalLocationUpdater();
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Mock geolocation updates (for demo purposes)
  useEffect(() => {
    if (!isTracking) return;
    
    let watchId: number | null = null;
    
    // Function to handle successful location acquisition
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocationData({ latitude, longitude });
      setError(null);
      
      // Send location update via WebSocket if connected, fallback to API
      if (isConnected) {
        const success = updateLocation(latitude, longitude);
        if (success) {
          setLastUpdateTime(new Date());
          toast({
            title: "Location Updated",
            description: "Your location has been broadcasted successfully",
            variant: "default",
          });
        }
      } else {
        // Fallback to API
        updateLocationViaApi(professionalId, latitude, longitude)
          .then(success => {
            if (success) {
              setLastUpdateTime(new Date());
              toast({
                title: "Location Updated (API)",
                description: "Your location has been updated via API",
                variant: "default",
              });
            }
          });
      }
    };
    
    // Function to handle errors
    const handleError = (error: GeolocationPositionError) => {
      let message;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "Location permission denied. Please enable location services.";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          message = "Location request timed out.";
          break;
        default:
          message = "An unknown error occurred.";
      }
      setError(message);
      toast({
        title: "Location Error",
        description: message,
        variant: "destructive",
      });
    };
    
    // Try to get user's location if browser supports geolocation
    if ('geolocation' in navigator) {
      try {
        // Watch position with high accuracy
        watchId = navigator.geolocation.watchPosition(
          handleSuccess, 
          handleError,
          { 
            enableHighAccuracy: true, 
            timeout: 15000, 
            maximumAge: 0 
          }
        );
      } catch (e) {
        setError("Failed to start location tracking");
      }
    } else {
      setError("Geolocation is not supported by this browser");
    }
    
    // Cleanup function to stop watching location
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, isConnected, updateLocation, updateLocationViaApi, professionalId, toast]);
  
  // Format time since last update
  const getTimeSinceUpdate = useCallback(() => {
    if (!lastUpdateTime) return 'No updates yet';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdateTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour} hours ago`;
  }, [lastUpdateTime]);
  
  // Ensure only the professional can update their own location
  if (user?.id !== professionalId) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            <Navigation className="inline-block mr-2 h-5 w-5" />
            Location Tracking
          </CardTitle>
          <Badge isConnected={isConnected} />
        </div>
        <CardDescription>
          Share your real-time location with clients who have made bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            id="location-tracking"
            checked={isTracking}
            onCheckedChange={setIsTracking}
          />
          <Label htmlFor="location-tracking">
            {isTracking ? 'Broadcasting location' : 'Location sharing is off'}
          </Label>
        </div>
        
        {error && (
          <div className="bg-red-50 p-3 rounded-md mb-4 text-red-600 text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {locationData && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Current Location
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Latitude:</span>
                <div className="font-mono">{locationData.latitude.toFixed(6)}</div>
              </div>
              <div>
                <span className="text-gray-500">Longitude:</span>
                <div className="font-mono">{locationData.longitude.toFixed(6)}</div>
              </div>
            </div>
            {lastUpdateTime && (
              <div className="mt-2 text-xs text-gray-500">
                Last broadcast: {getTimeSinceUpdate()}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          disabled={!isTracking}
        >
          Reconnect
        </Button>
        <Button 
          variant="default" 
          disabled={!locationData || !isTracking}
          onClick={() => {
            if (locationData) {
              if (isConnected) {
                updateLocation(locationData.latitude, locationData.longitude);
              } else {
                updateLocationViaApi(professionalId, locationData.latitude, locationData.longitude);
              }
              toast({
                title: "Location Manually Updated",
                description: "Your location has been broadcast to active clients",
              });
              setLastUpdateTime(new Date());
            }
          }}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Update Now
        </Button>
      </CardFooter>
    </Card>
  );
}

// Badge component to show connection status
function Badge({ isConnected }: { isConnected: boolean }) {
  return (
    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
      isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <>
          <Check className="h-3 w-3 mr-1" />
          Connected
        </>
      ) : (
        <>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Disconnected
        </>
      )}
    </div>
  );
}