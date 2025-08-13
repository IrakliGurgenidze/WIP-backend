import { Router } from 'express';
import { searchApplicants, getApplicantDetails } from '../controllers/searchController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All search routes require authentication
router.use(authenticate);

// Search applicants (recruiter only)
router.get('/applicants', searchApplicants);

// Get detailed applicant profile (recruiter only)
router.get('/applicants/:applicantId', getApplicantDetails);

export default router;