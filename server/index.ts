import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import expressSession from 'express-session';
import { Request, Response } from 'express';

//exported functions
import { connectDB } from './config/database.ts';

//route imports
import entryRoutes from './routes/entries.ts';
import chartDataRoutes from './routes/chartData.ts';
import authRouter from './routes/auth.ts';

import './passport/passport.ts';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  })
);
dotenv.config({ path: path.resolve(__dirname, './.env') });

// setting up express session
app.use(
  expressSession({
    secret: process.env.COOKIE_KEY as string,
    resave: false,
    saveUninitialized: true,
  })
);
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;

//routes
app.use('/entries', entryRoutes);
app.use('/chartData', chartDataRoutes);
app.use('/auth', authRouter);

connectDB();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
