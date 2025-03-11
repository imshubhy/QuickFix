import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Professional from "@/pages/professional";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Bookings from "@/pages/bookings";
import Tracking from "@/pages/tracking";
import { AuthProvider } from "@/context/auth-context";
import { BookingProvider } from "@/context/booking-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/services/:categoryId" component={Services} />
      <Route path="/professional/:id" component={Professional} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/tracking" component={Tracking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <Router />
          <Toaster />
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
