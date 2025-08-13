import { Router } from 'express';
import { 
  getApplicantProfile, 
  updateApplicantProfile,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
} from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Applicant profile routes
router.get('/applicant', getApplicantProfile);
router.put('/applicant', updateApplicantProfile);

// Work experience routes
router.post('/applicant/work-experience', addWorkExperience);
router.put('/applicant/work-experience/:experienceId', updateWorkExperience);
router.delete('/applicant/work-experience/:experienceId', deleteWorkExperience);

export default router;