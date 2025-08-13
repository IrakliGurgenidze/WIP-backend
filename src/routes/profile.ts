import { Router } from 'express';
import { 
  getApplicantProfile, 
  updateApplicantProfile,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getRecruiterProfile,
  updateRecruiterProfile
} from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Applicant profile routes
router.get('/applicant', getApplicantProfile);
router.put('/applicant', updateApplicantProfile);

// Work experience routes (applicant only)
router.post('/applicant/work-experience', addWorkExperience);
router.put('/applicant/work-experience/:experienceId', updateWorkExperience);
router.delete('/applicant/work-experience/:experienceId', deleteWorkExperience);

// Recruiter profile routes
router.get('/recruiter', getRecruiterProfile);
router.put('/recruiter', updateRecruiterProfile);

export default router;