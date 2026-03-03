import Internship from '../models/internship.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

// 1. Get All Internships (For Internship Hub)
export const getAllInternships = catchAsync(async (req, res, next) => {
    // Filter by 'open' status by default
    const filter = { status: 'open' };

    // Add search/category/type filters if needed from query params
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.search) {
        filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const internships = await Internship.find(filter).populate({
        path: 'industry',
        select: 'name avatar'
    });

    res.status(200).json({
        status: 'success',
        results: internships.length,
        data: { internships }
    });
});

// 2. Get Single Internship Detail
export const getInternship = catchAsync(async (req, res, next) => {
    const internship = await Internship.findById(req.params.id).populate('industry');

    if (!internship) {
        return next(new AppError('No internship found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { internship }
    });
});

// 3. Create Internship (For Industry - but needed for testing)
export const createInternship = catchAsync(async (req, res, next) => {
    // Ensure the industry ID is set from the logged-in user
    if (!req.body.industry) req.body.industry = req.user.id;

    const newInternship = await Internship.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { internship: newInternship }
    });
});
