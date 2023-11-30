import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
// import cookieSession from 'cookie-session';
import session from 'express-session';

//exported functions
import { connectDB } from './config/database.ts';
import User from './models/Users';

//route imports
import entryRoutes from './routes/entries.ts';
import chartDataRoutes from './routes/chartData.ts';
import authRouter from './routes/auth.ts';

// import './passport/passport.ts';

import { googleStrategy } from './passport/passport.ts';

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

app.set('trust proxy', 1);
app.enable('trust proxy');

// setting up express session
app.use(
  session({
    secret: process.env.COOKIE_KEY as string,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
);
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use('google', googleStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const port = process.env.PORT || 3000;

//routes
app.use('/entries', entryRoutes);
app.use('/chartData', chartDataRoutes);
app.use('/auth', authRouter);

connectDB();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
