import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import politicasRoutes from "./routes/politicas.router.js"
import xss from 'xss-clean';

const app=express()
app.use(xss());

app.use(cors({
    origin: 'http://localhost:5173',
    }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api',authRoutes);
app.use('/api',politicasRoutes);
export default app;