import express from 'express';
import applicationController from '../module/Application/applicationController';
import validationMiddleware from '../Middleware/validationMiddleware';
import {applicationSchema} from '../Validation/applicationValidation';
import userAuthorizationHandler from '../Middleware/authorizationMiddleware';

const ApplicationRouter = express.Router();

//candidate
ApplicationRouter.get('/applicant-jobs', userAuthorizationHandler("user"),  applicationController.getCandidateAppliedJobs);

ApplicationRouter.post('/apply', validationMiddleware(applicationSchema), applicationController.applyForJob);

//recruiter
ApplicationRouter.get('/recruiter-jobs', userAuthorizationHandler("recruiter"), applicationController.getRecruiterPostJobs);

ApplicationRouter.patch('/:id', userAuthorizationHandler("recruiter"), applicationController.updateJobStatus);

export default ApplicationRouter;