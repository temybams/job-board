import { SortOrder } from 'mongoose';
import JobModel, { IJob } from '../Model/JobModel';
import Application, {IApplication} from '../Model/ApplicationModel';

export interface QueryParams {
    sortBy?: string;
    skip?: number;
    limit?: number;
    fields?: string;
    page?: number;
}

const getData = async (filters: Record<string, any>, queries: QueryParams) => {
    let sortCriteria: { [key: string]: SortOrder } = {};

    // Sorting logic
    if (queries.sortBy) {
        switch (queries.sortBy) {
            case "newest":
                sortCriteria = { createdAt: -1 };
                break;
            case "oldest":
                sortCriteria = { createdAt: 1 };
                break;
            case "a-z":
                sortCriteria = { position: 1 };
                break;
            case "z-a":
                sortCriteria = { position: -1 };
                break;
            default:
                sortCriteria = { createdAt: -1 };
                break;
        }
    } else {
        sortCriteria = { createdAt: -1 };
    }

    // Fetching jobs based on filters, pagination, and sorting
    const result: IJob[] = await JobModel.find(filters)
        .skip(queries.skip || 0)
        .limit(queries.limit || 5)
        .sort(sortCriteria)
        .select(queries.fields ? queries.fields.split(',').join(' ') : '');

    // Total jobs count based on filters
    const totalJobs = await JobModel.countDocuments(filters);
    const pageCount = Math.ceil(totalJobs / (queries.limit || 5));

    return { result, totalJobs, pageCount, page: queries.page || 1 };
};

const getDataApplication = async (filters: any, queries: any) => {

    let sortCriteria: { [key: string]: SortOrder } = {};

    // Sorting logic
    if (queries.sortBy) {
        const sortFields = queries.sortBy.split(","); // Allow multiple sorting fields
        sortFields.forEach((field: string) => {
            switch (field.trim()) {
                case "newest":
                    sortCriteria.createdAt = -1;
                    break;
                case "oldest":
                    sortCriteria.createdAt = 1;
                    break;
                case "a-z":
                    sortCriteria.position = 1;
                    break;
                case "z-a":
                    sortCriteria.position = -1;
                    break;
                default:
                    sortCriteria.createdAt = -1; // Default sorting
                    break;
            }
        });
    } else {
        sortCriteria = { createdAt: -1 }; // Default sorting
    }

    // Pagination and limit checks (sanitize inputs)
    const page = queries.page ? Math.max(1, queries.page) : 1; // Ensure page is at least 1
    const limit = queries.limit ? Math.max(1, queries.limit) : 5; // Ensure limit is at least 1
    const skip = (page - 1) * limit;

    // Log the filtering and pagination details
    // console.log("Filters:", filters);
    // console.log("Pagination & Sorting:", { skip, limit, sortCriteria });

    // Fetching jobs based on filters, pagination, and sorting
    const result: IApplication[] = await Application.find(filters)
        .skip(skip)
        .limit(limit)
        .sort(sortCriteria)
        .select(queries.fields ? queries.fields.split(',').join(' ') : ''); // Handle field selection

    // Total jobs count based on filters
    const totalJobs = await Application.countDocuments(filters);
    const pageCount = Math.ceil(totalJobs / limit);

    return { result, totalJobs, pageCount, page };
};

export { getDataApplication, getData }
