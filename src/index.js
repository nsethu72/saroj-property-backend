import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import unitsRoutes from './routes/units.js';
import tenantsRoutes from './routes/tenants.js';
import leasesRoutes from './routes/leases.js';
import assetsRoutes from './routes/assets.js';
import fixturesRoutes from './routes/fixtures.js';
import rentRoutes from './routes/rent.js';
import { authMiddleware } from './middleware/auth.js';
import cron from 'node-cron';
import { runRentReminders } from './services/reminders.js';

const app = express();
const PORT = process.env.PORT || 5000;

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/properties', authMiddleware, propertiesRoutes);
app.use('/units', authMiddleware, unitsRoutes);
app.use('/tenants', authMiddleware, tenantsRoutes);
app.use('/leases', authMiddleware, leasesRoutes);
app.use('/assets', authMiddleware, assetsRoutes);
app.use('/fixtures', authMiddleware, fixturesRoutes);
app.use('/rent', authMiddleware, rentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Daily rent reminders at 9 AM
cron.schedule('0 9 * * *', () => {
  runRentReminders().catch(console.error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});