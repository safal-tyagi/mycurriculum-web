import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { passportConfig } from './config/passport.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';

dotenv.config();

const app = express();
//passportConfig(passport);

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
//app.use(passport.initialize());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 3000;

// front end
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
