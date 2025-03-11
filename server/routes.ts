import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { log } from "./vite";
import { 
  insertUserSchema, 
  insertServiceCategorySchema,
  insertServiceProfessionalSchema,
  insertReviewSchema,
  insertBookingSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Track WebSocket connections
const professionalSockets = new Map<string, WebSocket>();
const userSockets = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  
  // User routes
  app.post('/api/users/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      const user = await storage.createUser(userData);
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to login' });
    }
  });
  
  // Service Categories routes
  app.get('/api/categories', async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get categories' });
    }
  });
  
  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get category' });
    }
  });
  
  // Service Professionals routes
  app.get('/api/professionals', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let professionals;
      if (categoryId && !isNaN(categoryId)) {
        professionals = await storage.getProfessionalsByCategory(categoryId);
      } else {
        professionals = await storage.getAllProfessionals();
      }
      
      res.json(professionals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get professionals' });
    }
  });
  
  app.get('/api/professionals/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid professional ID' });
      }
      
      const professional = await storage.getProfessional(id);
      if (!professional) {
        return res.status(404).json({ message: 'Professional not found' });
      }
      
      res.json(professional);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get professional' });
    }
  });
  
  app.put('/api/professionals/:id/availability', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid professional ID' });
      }
      
      const { isAvailable, availableFrom, availableTo } = req.body;
      
      if (typeof isAvailable !== 'boolean') {
        return res.status(400).json({ message: 'isAvailable must be a boolean' });
      }
      
      const professional = await storage.updateProfessionalAvailability(
        id, 
        isAvailable, 
        availableFrom ? new Date(availableFrom) : undefined,
        availableTo ? new Date(availableTo) : undefined
      );
      
      if (!professional) {
        return res.status(404).json({ message: 'Professional not found' });
      }
      
      res.json(professional);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update professional availability' });
    }
  });
  
  // Review routes
  app.get('/api/professionals/:id/reviews', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid professional ID' });
      }
      
      const reviews = await storage.getReviewsForProfessional(id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get reviews' });
    }
  });
  
  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Failed to create review' });
    }
  });
  
  // Booking routes
  app.get('/api/users/:userId/bookings', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const bookings = await storage.getBookingsForUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get bookings' });
    }
  });
  
  app.get('/api/professionals/:professionalId/bookings', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      if (isNaN(professionalId)) {
        return res.status(400).json({ message: 'Invalid professional ID' });
      }
      
      const bookings = await storage.getBookingsForProfessional(professionalId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get bookings' });
    }
  });
  
  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
      }
      
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get booking' });
    }
  });
  
  app.post('/api/bookings', async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });
  
  app.put('/api/bookings/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
      }
      
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: 'Status is required and must be a string' });
      }
      
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update booking status' });
    }
  });

  // Add endpoint for professional location updates
  app.post('/api/professionals/:id/location', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid professional ID' });
      }
      
      const { latitude, longitude } = req.body;
      
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: 'Latitude and longitude are required and must be numbers' });
      }
      
      // Update professional's location
      const professional = await storage.updateProfessionalLocation(id, latitude, longitude);
      
      if (!professional) {
        return res.status(404).json({ message: 'Professional not found' });
      }
      
      // Broadcast location update to connected users who have booked this professional
      const bookings = await storage.getBookingsForProfessional(id);
      const activeBookings = bookings.filter(booking => 
        booking.status === 'confirmed' || booking.status === 'in_progress'
      );
      
      for (const booking of activeBookings) {
        const userSocket = userSockets.get(booking.userId.toString());
        if (userSocket && userSocket.readyState === WebSocket.OPEN) {
          userSocket.send(JSON.stringify({
            type: 'professionalLocation',
            professionalId: id,
            data: { latitude, longitude }
          }));
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update professional location' });
    }
  });
  
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws' // Use a dedicated path for WebSockets
  });
  
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    const professionalId = url.searchParams.get('professionalId');
    const type = url.searchParams.get('type'); // 'user' or 'professional'
    
    log(`WebSocket connected: ${type} ${userId || professionalId}`);
    
    if (type === 'professional' && professionalId) {
      professionalSockets.set(professionalId, ws);
      
      // Send initial location data if available
      const sendInitialLocation = async () => {
        try {
          const professional = await storage.getProfessional(parseInt(professionalId, 10));
          if (professional && professional.latitude !== null && professional.longitude !== null) {
            ws.send(JSON.stringify({
              type: 'location',
              data: {
                latitude: professional.latitude,
                longitude: professional.longitude
              }
            }));
          }
        } catch (error) {
          log(`Error sending initial location: ${error}`);
        }
      };
      
      sendInitialLocation();
    } else if (type === 'user' && userId) {
      userSockets.set(userId, ws);
      
      // Send any active professional locations to the user
      const sendActiveProfessionalLocations = async () => {
        try {
          const bookings = await storage.getBookingsForUser(parseInt(userId, 10));
          const activeBookings = bookings.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'in_progress'
          );
          
          for (const booking of activeBookings) {
            const professional = await storage.getProfessional(booking.professionalId);
            if (professional && professional.latitude !== null && professional.longitude !== null) {
              ws.send(JSON.stringify({
                type: 'professionalLocation',
                professionalId: professional.id,
                data: {
                  latitude: professional.latitude,
                  longitude: professional.longitude
                }
              }));
            }
          }
        } catch (error) {
          log(`Error sending active professional locations: ${error}`);
        }
      };
      
      sendActiveProfessionalLocations();
    }
    
    // Handle messages from clients
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'location' && type === 'professional' && professionalId) {
          const { latitude, longitude } = data.data;
          
          // Update professional's location in storage
          await storage.updateProfessionalLocation(
            parseInt(professionalId, 10),
            latitude,
            longitude
          );
          
          // Forward location update to all users who are tracking this professional
          const bookings = await storage.getBookingsForProfessional(parseInt(professionalId, 10));
          const activeBookings = bookings.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'in_progress'
          );
          
          for (const booking of activeBookings) {
            const userSocket = userSockets.get(booking.userId.toString());
            if (userSocket && userSocket.readyState === WebSocket.OPEN) {
              userSocket.send(JSON.stringify({
                type: 'professionalLocation',
                professionalId,
                data: { latitude, longitude }
              }));
            }
          }
        }
      } catch (error) {
        log(`WebSocket message error: ${error}`);
      }
    });
    
    // Handle disconnections
    ws.on('close', () => {
      if (type === 'professional' && professionalId) {
        professionalSockets.delete(professionalId);
        log(`Professional ${professionalId} disconnected`);
      } else if (type === 'user' && userId) {
        userSockets.delete(userId);
        log(`User ${userId} disconnected`);
      }
    });
  });
  
  return httpServer;
}
