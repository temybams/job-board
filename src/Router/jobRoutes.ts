import express from 'express';
import jobController from '../module/Job/jobcontrollers';
import userAuthorizationHandler from '../Middleware/authorizationMiddleware';
import authMiddleware from '../Middleware/authMiddleware';
import { jobSchema } from '../Validation/jobValidation';
import validationMiddleware from '../Middleware/validationMiddleware';
const jobRouter = express.Router();

jobRouter.get('/all', jobController.getAllJobs);

jobRouter.get('/my-jobs', jobController.getMyJobs);

jobRouter.get('/:id', jobController.getSingleJob);

jobRouter.post('/add', userAuthorizationHandler("recruiter"), validationMiddleware(jobSchema),jobController.addJob);

jobRouter.patch('/:id', userAuthorizationHandler("recruiter"), jobController.updateSingleJob);


jobRouter.delete('/:id', jobController.deleteSingleJob);

jobRouter.delete('/delete-all', jobController.deleteAllJobs);

export default jobRouter;