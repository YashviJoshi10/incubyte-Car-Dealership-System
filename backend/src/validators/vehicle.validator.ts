import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
    quantity: z
      .number({ invalid_type_error: 'Quantity must be a number' })
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative'),
  }),
});

export const updateVehicleSchema = z.object({
  body: z
    .object({
      make: z.string().min(1).optional(),
      model: z.string().min(1).optional(),
      category: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      quantity: z.number().int().min(0).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export const restockSchema = z.object({
  body: z.object({
    quantity: z
      .number({ invalid_type_error: 'Quantity must be a number' })
      .int('Quantity must be an integer')
      .positive('Restock quantity must be positive'),
  }),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>['body'];
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>['body'];
export type RestockDto = z.infer<typeof restockSchema>['body'];

export interface SearchVehicleFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
