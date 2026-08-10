Import ‘dotenv/config’;
Import express from ‘express’;
Import cors from ‘cors’;
Import { PrismaClient } from ‘@prisma/client’;
Import authRoutes from ‘./routes/auth.js’;
Import propertiesRoutes from ‘./routes/properties.js’;
Import unitsRoutes from ‘./routes/units.js’;
Import tenantsRoutes from ‘./routes/tenants.js’;
Import leasesRoutes from ‘./routes/leases.js’;
Import assetsRoutes from ‘./routes/assets.js’;
Import fixturesRoutes from ‘./routes/fixtures.js’;
Import rentRoutes from ‘./routes/rent.js’;
Import { authMiddleware } from ‘./middleware/auth.js’;
Import cron from ‘node-cron’;
Import { runRentReminders } from ‘./services/reminders.js’;

Const app = express();
Const PORT = process.env.PORT || 5000;

Export const prisma = new PrismaClient();

App.use(cors());
App.use(express.json());

// Public routes
App.use(‘/auth’, authRoutes);

// Protected routes
App.use(‘/properties’, authMiddleware, propertiesRoutes);
App.use(‘/units’, authMiddleware, unitsRoutes);
App.use(‘/tenants’, authMiddleware, tenantsRoutes);
App.use(‘/leases’, authMiddleware, leasesRoutes);
App.use(‘/assets’, authMiddleware, assetsRoutes);
App.use(‘/fixtures’, authMiddleware, fixturesRoutes);
App.use(‘/rent’, authMiddleware, rentRoutes);

App.get(‘/health’, (req, res) => {
  Res.json({ status: ‘ok’ });
});

// Daily rent reminders at 9 AM
Cron.schedule(‘0 9 * * *’, () => {
  runRentReminders().catch(console.error);
});

App.listen(PORT, () => {
  Console.log(`Server running on port ${PORT}`);
});
