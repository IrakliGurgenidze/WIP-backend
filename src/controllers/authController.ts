// signup/login logic

import { Request, Response } from 'express';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import prisma from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET as string; // Secret key for signing JWTs

// Controller for user signup
export const signup = async (req: Request, res: Response) => {
  const { email, password, role } = req.body; // Extract email, password, and role from request body

  // Check for missing fields
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Check if user already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        role
      }
    });

    // Create corresponding profile based on role
    if (role === 'applicant') {
      await prisma.applicantProfile.create({
        data: {
          userId: user.id
        }
      });
    } else if (role === 'recruiter') {
      await prisma.recruiterProfile.create({
        data: {
          userId: user.id
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.status(201).json({ 
      message: 'Signup successful', 
      user: { 
        email: user.email, 
        role: user.role,
        profileCreated: true
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

// Controller for user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    // Return both token AND user data
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};