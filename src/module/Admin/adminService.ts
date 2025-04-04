import User from "../../Model/UserModel";
import throwError from "../../types/error";
import httpStatus from "http-status";
import Job from "../../Model/JobModel";
import mongoose from "mongoose";
import day from "dayjs";


const AdminService = {

    getAllInfo: async () => {
        const [users, admin, recruiter, applicant, jobs, interviewJobs, pendingJobs, declinedJobs] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "recruiter" }),
            User.countDocuments({ role: "user" }),
            Job.countDocuments(),
            Job.countDocuments({ jobStatus: "interview" }),
            Job.countDocuments({ jobStatus: "pending" }),
            Job.countDocuments({ jobStatus: "declined" }),
        ]);

        return {
            user: users,
            admin,
            recruiter,
            applicant,
            job: jobs,
            interview: interviewJobs,
            pending: pendingJobs,
            declined: declinedJobs,
        };
    },

    monthlyInfo: async () => {
        const statsArray = await Job.aggregate([
            { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
        ]);

        const stats = statsArray.reduce<Record<string, number>>((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        const defaultStats = [
            { name: "pending", value: stats.pending || 0 },
            { name: "interview", value: stats.interview || 0 },
            { name: "declined", value: stats.declined || 0 },
        ];

        const monthlyStatsArray = await Job.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 },
        ]);

        const monthly_stats = monthlyStatsArray
            .map(({ _id: { year, month }, count }) => ({
                date: day().month(month - 1).year(year).format("MMM YY"),
                count,
            }))
            .reverse();


        return { defaultStats, monthly_stats };

    },

    updateUserRole: async (adminId: string, userId: string, role: string) => {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid User ID format");
        }



        const adminUser = await User.findById(adminId);
        if (!adminUser || adminUser.role !== "admin") {
            throw new Error("You have no permission to update roles");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { role } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found or role update failed");
        }
        return updatedUser;
    }
}

export default AdminService;