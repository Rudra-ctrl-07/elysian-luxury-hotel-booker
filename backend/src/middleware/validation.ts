import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const authSchemas = {
  signup: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const bookingSchemas = {
  create: Joi.object({
    roomId: Joi.number().integer().positive().required(),
    checkIn: Joi.date().iso().greater('now').required(),
    checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
    guests: Joi.number().integer().min(1).max(10).required(),
    personalDetails: Joi.object({
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(15).required(),
    }).required(),
    paymentDetails: Joi.object({
      cardNumber: Joi.string().pattern(/^\d{16}$/).required(),
      expiryDate: Joi.string().pattern(/^\d{2}\/\d{2}$/).required(),
      cvv: Joi.string().pattern(/^\d{3,4}$/).required(),
      nameOnCard: Joi.string().min(2).max(50).required(),
    }).required(),
  }),
};
