import { Request, Response } from 'express';
import prisma from '../config/database';

// Get applicant profile
export const getApplicantProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const profile = await prisma.applicantProfile.findUnique({
      where: { userId },
      include: {
        workExperience: true,
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
};

// Update applicant profile
export const updateApplicantProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user is an applicant
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'applicant') {
      return res.status(403).json({ message: 'Access denied. Applicant role required.' });
    }

    // Only update fields that are provided in the request body
    const updateData: any = {};
    const allowedFields = [
      'firstName', 'lastName', 'phoneNumber', 'university', 'major', 
      'graduationYear', 'gpa', 'portfolioUrl', 'linkedinUrl', 'githubUrl',
      'skills', 'interests', 'experienceLevel', 'preferredLocations',
      'salaryExpectation', 'availability', 'other'
    ];

    // Only include fields that are actually provided
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedProfile = await prisma.applicantProfile.update({
      where: { userId },
      data: updateData,
      include: {
        workExperience: true
      }
    });

    res.json({ 
      message: 'Profile updated successfully', 
      profile: updatedProfile 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};

// Add work experience
export const addWorkExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get applicant profile ID
    const profile = await prisma.applicantProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Applicant profile not found' });
    }

    const { companyName, location, startDate, endDate, roleDescription } = req.body;

    const workExperience = await prisma.workExperience.create({
      data: {
        applicantProfileId: profile.id,
        companyName,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        roleDescription
      }
    });

    res.status(201).json({ 
      message: 'Work experience added successfully', 
      workExperience 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add work experience', error });
  }
};

// Update work experience
export const updateWorkExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { experienceId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify the work experience belongs to this user
    const workExperience = await prisma.workExperience.findFirst({
      where: {
        id: parseInt(experienceId),
        applicantProfile: {
          userId: userId
        }
      }
    });

    if (!workExperience) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    const { companyName, location, startDate, endDate, roleDescription } = req.body;

    const updatedExperience = await prisma.workExperience.update({
      where: { id: parseInt(experienceId) },
      data: {
        companyName,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        roleDescription
      }
    });

    res.json({ 
      message: 'Work experience updated successfully', 
      workExperience: updatedExperience 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update work experience', error });
  }
};

// Delete work experience
export const deleteWorkExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { experienceId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify the work experience belongs to this user
    const workExperience = await prisma.workExperience.findFirst({
      where: {
        id: parseInt(experienceId),
        applicantProfile: {
          userId: userId
        }
      }
    });

    if (!workExperience) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    await prisma.workExperience.delete({
      where: { id: parseInt(experienceId) }
    });

    res.json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete work experience', error });
  }
};