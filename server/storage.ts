import { 
  users, type User, type InsertUser,
  serviceCategories, type ServiceCategory, type InsertServiceCategory,
  serviceProfessionals, type ServiceProfessional, type InsertServiceProfessional,
  reviews, type Review, type InsertReview,
  bookings, type Booking, type InsertBooking,
  type ServiceProfessionalWithDetails
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service Category operations
  getAllCategories(): Promise<ServiceCategory[]>;
  getCategory(id: number): Promise<ServiceCategory | undefined>;
  createCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Service Professional operations
  getAllProfessionals(): Promise<ServiceProfessionalWithDetails[]>;
  getProfessionalsByCategory(categoryId: number): Promise<ServiceProfessionalWithDetails[]>;
  getProfessional(id: number): Promise<ServiceProfessionalWithDetails | undefined>;
  createProfessional(professional: InsertServiceProfessional): Promise<ServiceProfessional>;
  updateProfessionalAvailability(id: number, isAvailable: boolean, availableFrom?: Date, availableTo?: Date): Promise<ServiceProfessional | undefined>;
  updateProfessionalLocation(id: number, latitude: number, longitude: number): Promise<ServiceProfessional | undefined>;
  
  // Review operations
  getReviewsForProfessional(professionalId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Booking operations
  getBookingsForUser(userId: number): Promise<Booking[]>;
  getBookingsForProfessional(professionalId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private serviceCategories: Map<number, ServiceCategory>;
  private serviceProfessionals: Map<number, ServiceProfessional>;
  private reviews: Map<number, Review>;
  private bookings: Map<number, Booking>;
  
  private userId: number;
  private categoryId: number;
  private professionalId: number;
  private reviewId: number;
  private bookingId: number;
  
  constructor() {
    this.users = new Map();
    this.serviceCategories = new Map();
    this.serviceProfessionals = new Map();
    this.reviews = new Map();
    this.bookings = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.professionalId = 1;
    this.reviewId = 1;
    this.bookingId = 1;
    
    // Seed some initial data
    this.seedInitialData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(userInsert: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...userInsert, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Service Category operations
  async getAllCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }
  
  async getCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }
  
  async createCategory(categoryInsert: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.categoryId++;
    const category: ServiceCategory = { ...categoryInsert, id };
    this.serviceCategories.set(id, category);
    return category;
  }
  
  // Service Professional operations
  async getAllProfessionals(): Promise<ServiceProfessionalWithDetails[]> {
    return this.getProfessionalsWithDetails();
  }
  
  async getProfessionalsByCategory(categoryId: number): Promise<ServiceProfessionalWithDetails[]> {
    const professionals = this.getProfessionalsWithDetails();
    return professionals.filter(pro => pro.categoryId === categoryId);
  }
  
  async getProfessional(id: number): Promise<ServiceProfessionalWithDetails | undefined> {
    const pro = this.serviceProfessionals.get(id);
    if (!pro) return undefined;
    
    return this.enrichProfessionalWithDetails(pro);
  }
  
  async createProfessional(proInsert: InsertServiceProfessional): Promise<ServiceProfessional> {
    const id = this.professionalId++;
    const professional: ServiceProfessional = { ...proInsert, id };
    this.serviceProfessionals.set(id, professional);
    return professional;
  }
  
  async updateProfessionalAvailability(id: number, isAvailable: boolean, availableFrom?: Date, availableTo?: Date): Promise<ServiceProfessional | undefined> {
    const professional = this.serviceProfessionals.get(id);
    if (!professional) return undefined;
    
    const updatedProfessional: ServiceProfessional = {
      ...professional,
      isAvailable,
      availableFrom,
      availableTo
    };
    
    this.serviceProfessionals.set(id, updatedProfessional);
    return updatedProfessional;
  }
  
  async updateProfessionalLocation(id: number, latitude: number, longitude: number): Promise<ServiceProfessional | undefined> {
    const professional = this.serviceProfessionals.get(id);
    if (!professional) return undefined;
    
    const updatedProfessional: ServiceProfessional = {
      ...professional,
      latitude,
      longitude
    };
    
    this.serviceProfessionals.set(id, updatedProfessional);
    return updatedProfessional;
  }
  
  // Review operations
  async getReviewsForProfessional(professionalId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.professionalId === professionalId);
  }
  
  async createReview(reviewInsert: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const createdAt = new Date();
    const review: Review = { ...reviewInsert, id, createdAt };
    this.reviews.set(id, review);
    return review;
  }
  
  // Booking operations
  async getBookingsForUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }
  
  async getBookingsForProfessional(professionalId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.professionalId === professionalId);
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async createBooking(bookingInsert: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const createdAt = new Date();
    const booking: Booking = { ...bookingInsert, id, createdAt };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking: Booking = {
      ...booking,
      status
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Helper methods
  private getProfessionalsWithDetails(): ServiceProfessionalWithDetails[] {
    return Array.from(this.serviceProfessionals.values())
      .map(pro => this.enrichProfessionalWithDetails(pro));
  }
  
  private enrichProfessionalWithDetails(professional: ServiceProfessional): ServiceProfessionalWithDetails {
    const user = this.users.get(professional.userId);
    const category = this.serviceCategories.get(professional.categoryId);
    
    if (!user || !category) {
      throw new Error(`Missing user or category for professional ${professional.id}`);
    }
    
    const professionalReviews = Array.from(this.reviews.values())
      .filter(review => review.professionalId === professional.id);
    
    const totalReviews = professionalReviews.length;
    const totalRating = professionalReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    
    // Calculate random distance for demo purposes
    const distance = Math.round((Math.random() * 5 + 0.5) * 10) / 10;
    
    return {
      ...professional,
      user,
      category,
      avgRating,
      totalReviews,
      distance
    };
  }

  private seedInitialData() {
    // Seed users
    const user1: User = {
      id: this.userId++,
      username: "customer1",
      password: "password123",
      email: "customer1@example.com",
      fullName: "John Customer",
      phone: "123-456-7890",
      address: "123 Main St, City",
      role: "customer",
      createdAt: new Date()
    };
    
    const user2: User = {
      id: this.userId++,
      username: "james_wilson",
      password: "password123",
      email: "james@example.com",
      fullName: "James Wilson",
      phone: "234-567-8901",
      address: "456 Elm St, City",
      role: "professional",
      createdAt: new Date()
    };
    
    const user3: User = {
      id: this.userId++,
      username: "sarah_chen",
      password: "password123",
      email: "sarah@example.com",
      fullName: "Sarah Chen",
      phone: "345-678-9012",
      address: "789 Oak St, City",
      role: "professional",
      createdAt: new Date()
    };
    
    const user4: User = {
      id: this.userId++,
      username: "marcus_johnson",
      password: "password123",
      email: "marcus@example.com",
      fullName: "Marcus Johnson",
      phone: "456-789-0123",
      address: "101 Pine St, City",
      role: "professional",
      createdAt: new Date()
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    this.users.set(user4.id, user4);
    
    // Seed service categories
    const category1: ServiceCategory = {
      id: this.categoryId++,
      name: "Plumbing",
      description: "Plumbing services including leak repairs and pipe installation",
      icon: "ri-tools-line",
      startingPrice: 25,
      color: "#FF6B6B"
    };
    
    const category2: ServiceCategory = {
      id: this.categoryId++,
      name: "Electrical",
      description: "Electrical services including wiring and repairs",
      icon: "ri-plug-line",
      startingPrice: 30,
      color: "#4ECDC4"
    };
    
    const category3: ServiceCategory = {
      id: this.categoryId++,
      name: "Carpentry",
      description: "Carpentry services including furniture assembly and repairs",
      icon: "ri-hammer-line",
      startingPrice: 35,
      color: "#FF6B6B"
    };
    
    const category4: ServiceCategory = {
      id: this.categoryId++,
      name: "Painting",
      description: "Painting services for interior and exterior",
      icon: "ri-paint-brush-line",
      startingPrice: 40,
      color: "#4ECDC4"
    };
    
    const category5: ServiceCategory = {
      id: this.categoryId++,
      name: "Appliance",
      description: "Appliance repair and installation",
      icon: "ri-home-gear-line",
      startingPrice: 45,
      color: "#FF6B6B"
    };
    
    const category6: ServiceCategory = {
      id: this.categoryId++,
      name: "Gardening",
      description: "Gardening and landscaping services",
      icon: "ri-leaf-line",
      startingPrice: 20,
      color: "#4ECDC4"
    };
    
    this.serviceCategories.set(category1.id, category1);
    this.serviceCategories.set(category2.id, category2);
    this.serviceCategories.set(category3.id, category3);
    this.serviceCategories.set(category4.id, category4);
    this.serviceCategories.set(category5.id, category5);
    this.serviceCategories.set(category6.id, category6);
    
    // Seed service professionals
    const pro1: ServiceProfessional = {
      id: this.professionalId++,
      userId: user2.id,
      categoryId: category1.id,
      title: "Plumbing Specialist",
      description: "Experienced plumber specializing in leak repairs and pipe installation",
      hourlyRate: 35,
      skills: "Leak Repairs, Pipe Installation",
      isAvailable: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      latitude: 40.7128,
      longitude: -74.0060
    };
    
    const pro2: ServiceProfessional = {
      id: this.professionalId++,
      userId: user3.id,
      categoryId: category2.id,
      title: "Electrical Technician",
      description: "Certified electrician with expertise in wiring, panel repairs, and fixtures",
      hourlyRate: 40,
      skills: "Wiring, Panel Repairs, Fixtures",
      isAvailable: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      latitude: 40.7148,
      longitude: -74.0068
    };
    
    const pro3: ServiceProfessional = {
      id: this.professionalId++,
      userId: user4.id,
      categoryId: category3.id,
      title: "Carpenter",
      description: "Professional carpenter specializing in furniture assembly and custom woodwork",
      hourlyRate: 45,
      skills: "Furniture Assembly, Custom Work",
      isAvailable: false,
      availableFrom: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      availableTo: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      latitude: 40.7135,
      longitude: -74.0055
    };
    
    this.serviceProfessionals.set(pro1.id, pro1);
    this.serviceProfessionals.set(pro2.id, pro2);
    this.serviceProfessionals.set(pro3.id, pro3);
    
    // Seed reviews
    const review1: Review = {
      id: this.reviewId++,
      professionalId: pro1.id,
      userId: user1.id,
      rating: 5,
      comment: "James was amazing! Fixed my leak in no time.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    };
    
    const review2: Review = {
      id: this.reviewId++,
      professionalId: pro2.id,
      userId: user1.id,
      rating: 5,
      comment: "Sarah was very professional and did an excellent job with my electrical issues.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    };
    
    const review3: Review = {
      id: this.reviewId++,
      professionalId: pro3.id,
      userId: user1.id,
      rating: 4,
      comment: "Marcus assembled my furniture quickly, but was a bit late.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    };
    
    this.reviews.set(review1.id, review1);
    this.reviews.set(review2.id, review2);
    this.reviews.set(review3.id, review3);
    
    // Seed some additional reviews to have more data
    for (let i = 0; i < 20; i++) {
      const proId = (i % 3) + 1; // Distribute across all 3 professionals
      const rating = Math.floor(Math.random() * 2) + 4; // Ratings between 4-5
      const review: Review = {
        id: this.reviewId++,
        professionalId: proId,
        userId: user1.id,
        rating: rating,
        comment: `Great service, would recommend!`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in last 30 days
      };
      this.reviews.set(review.id, review);
    }
    
    // Seed bookings
    const booking1: Booking = {
      id: this.bookingId++,
      userId: user1.id,
      professionalId: pro1.id,
      serviceType: "Leak Repair",
      address: "123 Main St, Apt 4B, City",
      instructions: "Leak under kitchen sink",
      status: "completed",
      scheduledFor: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      estimatedArrival: 15, // 15 minutes
      totalCost: 70, // $70
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    };
    
    const booking2: Booking = {
      id: this.bookingId++,
      userId: user1.id,
      professionalId: pro2.id,
      serviceType: "Light Fixture Installation",
      address: "123 Main St, Apt 4B, City",
      instructions: "Living room ceiling light",
      status: "scheduled",
      scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      estimatedArrival: 10, // 10 minutes
      totalCost: 80, // $80
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    };
    
    this.bookings.set(booking1.id, booking1);
    this.bookings.set(booking2.id, booking2);
  }
}

export const storage = new MemStorage();
