import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
// import expressSession from 'express-session';
import cookieSession from 'cookie-session';
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
app.use(cors({ origin: "https://expense-tracker-phi-gold.vercel.app/", credentials: true }))

dotenv.config({ path: path.resolve(__dirname, './.env') });

app.set('trust proxy', 1);

// setting up express session
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY as string],
    maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    sameSite: 'none',
    // secure: true,
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
