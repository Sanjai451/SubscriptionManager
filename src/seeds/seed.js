require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Plan = require('../models/Plan');
const User = require('../models/User');

const plans = [
  {
    name: 'Free',
    price: 0,
    duration: 30,
    features: [
      '1 Project',
      '5 GB Storage',
      'Basic Analytics',
      'Email Support',
      'API Access (100 req/day)',
    ],
    isActive: true,
  },
  {
    name: 'Starter',
    price: 9.99,
    duration: 30,
    features: [
      '5 Projects',
      '20 GB Storage',
      'Advanced Analytics',
      'Priority Email Support',
      'API Access (1000 req/day)',
      'Custom Domain',
    ],
    isActive: true,
  },
  {
    name: 'Pro',
    price: 29.99,
    duration: 30,
    features: [
      'Unlimited Projects',
      '100 GB Storage',
      'Full Analytics Suite',
      '24/7 Chat Support',
      'API Access (Unlimited)',
      'Custom Domain',
      'Team Collaboration (5 users)',
      'Advanced Security',
    ],
    isActive: true,
  },
  {
    name: 'Enterprise',
    price: 99.99,
    duration: 30,
    features: [
      'Unlimited Projects',
      '1 TB Storage',
      'Enterprise Analytics',
      'Dedicated Account Manager',
      'API Access (Unlimited)',
      'Custom Domain',
      'Team Collaboration (Unlimited)',
      'SSO & SAML',
      'SLA 99.99% Uptime',
      'On-premise Deployment Option',
    ],
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('🗑️  Cleared existing plans');

    // Insert new plans
    const createdPlans = await Plan.insertMany(plans);
    console.log(`✅ Inserted ${createdPlans.length} plans`);

    // Create a demo admin user (if not exists)
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Created admin user: admin@demo.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create a demo regular user (if not exists)
    const existingUser = await User.findOne({ email: 'user@demo.com' });
    if (!existingUser) {
      await User.create({
        name: 'Demo User',
        email: 'user@demo.com',
        password: 'user1234',
        role: 'user',
      });
      console.log('✅ Created demo user: user@demo.com / user1234');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    console.log('\n🌱 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Admin: admin@demo.com / admin123');
    console.log('   User:  user@demo.com / user1234');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
