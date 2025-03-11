import { useState, useEffect } from 'react';
import { useLocationTracking } from '@/hooks/use-location-tracking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';

interface LocationTrackerProps {
  professionalId: number;
  professionalName: string;
}

export function LocationTracker({ professionalId, professionalName }: LocationTrackerProps) {
  const { isConnected, getProfessionalLocation } = useLocationTracking();
  const location = getProfessionalLocation(professionalId);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Set lastUpdated whenever location changes
  useEffect(() => {
    if (location) {
      setLastUpdated(new Date());
    }
  }, [location]);

  // Format time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return 'No updates yet';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour} hours ago`;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-primary">
            <MapPin className="inline-block mr-2 h-5 w-5" />
            {professionalName}'s Location
          </CardTitle>
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <CardDescription>
          {lastUpdated ? (
            <span>Last updated: {getTimeSinceUpdate()}</span>
          ) : (
            <span className="text-yellow-600">
              <AlertTriangle className="inline-block mr-1 h-4 w-4" />
              Waiting for location updates...
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {location ? (
          <div className="relative w-full h-80 rounded-lg overflow-hidden border">
            {/* For demo purposes using a placeholder map with coordinates */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg">Professional's Location</h3>
                <p className="mt-2">
                  <strong>Latitude:</strong> {location.latitude.toFixed(6)}<br />
                  <strong>Longitude:</strong> {location.longitude.toFixed(6)}
                </p>
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
                  Note: To show a real map, we would use Google Maps API or similar.
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-white p-2 rounded-md shadow text-sm">
              <strong>Lat:</strong> {location.latitude.toFixed(6)}<br />
              <strong>Lng:</strong> {location.longitude.toFixed(6)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg">
            <Navigation className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">
              No location data available yet. The professional may be offline or location sharing is disabled.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Connection
        </Button>
        {location && (
          <Button variant="default">
            <MapPin className="mr-2 h-4 w-4" />
            View Full Map
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}