import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import globalErrorHandler from './middleware/error.middleware.js';
import AppError from './utils/appError.utils.js';
import authRoutes from './routes/auth.routes.js';
import internshipRoutes from './routes/internship.routes.js';
import applicationRoutes from './routes/application.routes.js';
import logRoutes from './routes/log.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import supervisorRoutes from './routes/supervisor.routes.js';
import industryRoutes from './routes/industry.routes.js';
import requestLogger from './middleware/log.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(requestLogger);
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// Serve uploaded files (certificates, CVs, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/industry', industryRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'IMS API is up and running' });
});


app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(globalErrorHandler);

export default app;
