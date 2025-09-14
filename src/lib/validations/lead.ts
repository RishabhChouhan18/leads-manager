import { z } from 'zod';

export const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  source: z.enum(['website', 'referral', 'cold-call', 'social-media', 'other']).optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).default('new'),
  budget: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const leadSearchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type LeadSearchParams = z.infer<typeof leadSearchSchema>;