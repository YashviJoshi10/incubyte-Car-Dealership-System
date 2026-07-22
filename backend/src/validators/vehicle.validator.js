const { z } = require('zod');

const createVehicleSchema = z.object({
  body: z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
    quantity: z
      .number({ invalid_type_error: 'Quantity must be a number' })
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative'),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
    year: z.number().int().min(1900).max(2030).optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    mileage: z.string().optional(),
    seating: z.number().int().positive().optional(),
    description: z.string().optional(),
  }),
});

const updateVehicleSchema = z.object({
  body: z
    .object({
      make: z.string().min(1).optional(),
      model: z.string().min(1).optional(),
      category: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      quantity: z.number().int().min(0).optional(),
      imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
      year: z.number().int().min(1900).max(2030).optional(),
      fuelType: z.string().optional(),
      transmission: z.string().optional(),
      mileage: z.string().optional(),
      seating: z.number().int().positive().optional(),
      description: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

const restockSchema = z.object({
  body: z.object({
    quantity: z
      .number({ invalid_type_error: 'Quantity must be a number' })
      .int('Quantity must be an integer')
      .positive('Restock quantity must be positive'),
  }),
});

module.exports = { createVehicleSchema, updateVehicleSchema, restockSchema };
