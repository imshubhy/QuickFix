import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  address: text("address"),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Service Category table
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  startingPrice: integer("starting_price").notNull(),
  color: text("color").notNull().default("#FF6B6B"), // Default to primary color
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
});

// Service Professionals table
export const serviceProfessionals = pgTable("service_professionals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  hourlyRate: integer("hourly_rate").notNull(),
  skills: text("skills"),
  isAvailable: boolean("is_available").notNull().default(true),
  availableFrom: timestamp("available_from"),
  availableTo: timestamp("available_to"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const insertServiceProfessionalSchema = createInsertSchema(serviceProfessionals).omit({
  id: true,
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  professionalId: integer("professional_id").notNull(), 
  serviceType: text("service_type").notNull(),
  address: text("address").notNull(),
  instructions: text("instructions"),
  status: text("status").notNull().default("pending"),
  scheduledFor: timestamp("scheduled_for"),
  estimatedArrival: integer("estimated_arrival").notNull(), // in minutes
  totalCost: integer("total_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;

export type ServiceProfessional = typeof serviceProfessionals.$inferSelect;
export type InsertServiceProfessional = z.infer<typeof insertServiceProfessionalSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Extended types with joined data
export type ServiceProfessionalWithDetails = ServiceProfessional & {
  user: User;
  category: ServiceCategory;
  avgRating?: number;
  totalReviews?: number;
  distance?: number;
};
