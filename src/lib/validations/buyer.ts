import { z } from 'zod';

// Enums as constants for reuse
export const CITIES = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const;
export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const;
export const BHK_OPTIONS = ['1', '2', '3', '4', 'Studio'] as const;
export const PURPOSES = ['Buy', 'Rent'] as const;
export const TIMELINES = ['0-3m', '3-6m', '>6m', 'Exploring'] as const;
export const SOURCES = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] as const;
export const STATUSES = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const;

export const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be less than 80 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: z.enum(CITIES),
  propertyType: z.enum(PROPERTY_TYPES),
  bhk: z.enum(BHK_OPTIONS).optional(),
  purpose: z.enum(PURPOSES),
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: z.enum(TIMELINES),
  source: z.enum(SOURCES),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(STATUSES).default('New'),
}).refine((data) => {
  // BHK required for Apartment/Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment/Villa properties',
  path: ['bhk'],
}).refine((data) => {
  // Budget validation
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export const buyerUpdateSchema = buyerSchema.extend({
  id: z.string(),
  updatedAt: z.number(), // For concurrency check
});

export const buyerSearchSchema = z.object({
  search: z.string().optional(),
  city: z.enum(CITIES).optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  status: z.enum(STATUSES).optional(),
  timeline: z.enum(TIMELINES).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type BuyerFormData = z.infer<typeof buyerSchema>;
export type BuyerUpdateData = z.infer<typeof buyerUpdateSchema>;
export type BuyerSearchParams = z.infer<typeof buyerSearchSchema>;