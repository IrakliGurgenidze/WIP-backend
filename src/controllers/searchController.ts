import { Request, Response } from 'express';
import prisma from '../config/database';

export const searchApplicants = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user is a recruiter
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied. Recruiter role required.' });
    }

    // Extract query parameters
    const {
      graduationYear,
      major,
      university,
      experienceLevel,
      minGpa,
      maxGpa,
      skills,
      preferredLocations,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter conditions
    const whereClause: any = {};

    // Graduation year filter
    if (graduationYear) {
      whereClause.graduationYear = parseInt(graduationYear as string);
    }

    // Major filter (case-insensitive partial match)
    if (major) {
      whereClause.major = {
        contains: major as string,
        mode: 'insensitive'
      };
    }

    // University filter (case-insensitive partial match)
    if (university) {
      whereClause.university = {
        contains: university as string,
        mode: 'insensitive'
      };
    }

    // Experience level filter
    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel as string;
    }

    // GPA range filter
    if (minGpa || maxGpa) {
      whereClause.gpa = {};
      if (minGpa) {
        whereClause.gpa.gte = parseFloat(minGpa as string);
      }
      if (maxGpa) {
        whereClause.gpa.lte = parseFloat(maxGpa as string);
      }
    }

    // Skills filter (array contains any of the specified skills)
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      whereClause.skills = {
        hasSome: skillsArray as string[]
      };
    }

    // Preferred locations filter (array contains any of the specified locations)
    if (preferredLocations) {
      const locationsArray = Array.isArray(preferredLocations) ? preferredLocations : [preferredLocations];
      whereClause.preferredLocations = {
        hasSome: locationsArray as string[]
      };
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50); // Max 50 results per page
    const skip = (pageNum - 1) * limitNum;

    // Execute search query
    const [applicants, totalCount] = await Promise.all([
      prisma.applicantProfile.findMany({
        where: whereClause,
        include: {
          workExperience: {
            orderBy: {
              startDate: 'desc'
            }
          },
          user: {
            select: {
              email: true,
              createdAt: true
            }
          }
        },
        orderBy: [
          { updatedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limitNum
      }),
      prisma.applicantProfile.count({
        where: whereClause
      })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      applicants,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to search applicants', error });
  }
};

// Get detailed applicant profile (for recruiter view)
export const getApplicantDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { applicantId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user is a recruiter
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied. Recruiter role required.' });
    }

    const applicant = await prisma.applicantProfile.findUnique({
      where: { id: parseInt(applicantId) },
      include: {
        workExperience: {
          orderBy: {
            startDate: 'desc'
          }
        },
        user: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.json({ applicant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applicant details', error });
  }
};