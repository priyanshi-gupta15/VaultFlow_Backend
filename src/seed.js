// src/seed.js
import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data
  await prisma.financialRecord.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('admin123', 12);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@vaultflow.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created Admin:', admin.email);

  // 2. Create Analyst
  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@vaultflow.com',
      password: hashedPassword,
      name: 'Lead Analyst',
      role: 'ANALYST',
    },
  });
  console.log('✅ Created Analyst:', analyst.email);

  // 3. Create Viewer
  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@vaultflow.com',
      password: hashedPassword,
      name: 'Guest Viewer',
      role: 'VIEWER',
    },
  });
  console.log('✅ Created Viewer:', viewer.email);

  // 4. Create diverse Financial Records spread across multiple months
  const now = new Date();
  const records = [
    // Current month
    { amount: 8500, type: 'INCOME', category: 'Salary', description: 'Monthly salary - April', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth(), 1) },
    { amount: 1200, type: 'EXPENSE', category: 'Rent', description: 'Office space rent', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth(), 2) },
    { amount: 350, type: 'EXPENSE', category: 'Food', description: 'Team lunch and snacks', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth(), 3) },
    { amount: 2500, type: 'INCOME', category: 'Freelance', description: 'UI/UX consulting project', userId: analyst.id, date: new Date(now.getFullYear(), now.getMonth(), 5) },
    { amount: 180, type: 'EXPENSE', category: 'Transport', description: 'Uber rides - week 1', userId: analyst.id, date: new Date(now.getFullYear(), now.getMonth(), 4) },
    { amount: 99, type: 'EXPENSE', category: 'Subscriptions', description: 'Adobe Creative Suite', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth(), 6) },

    // Last month
    { amount: 8500, type: 'INCOME', category: 'Salary', description: 'Monthly salary - March', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 1, 1) },
    { amount: 1200, type: 'EXPENSE', category: 'Rent', description: 'Office space rent', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 1, 2) },
    { amount: 450, type: 'EXPENSE', category: 'Utilities', description: 'Electricity + Internet', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 1, 10) },
    { amount: 3000, type: 'INCOME', category: 'Investment', description: 'Stock dividends Q1', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 1, 15) },
    { amount: 600, type: 'EXPENSE', category: 'Marketing', description: 'Facebook ads campaign', userId: analyst.id, date: new Date(now.getFullYear(), now.getMonth() - 1, 12) },

    // 2 months ago
    { amount: 8500, type: 'INCOME', category: 'Salary', description: 'Monthly salary - February', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 2, 1) },
    { amount: 1200, type: 'EXPENSE', category: 'Rent', description: 'Office space rent', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 2, 2) },
    { amount: 750, type: 'EXPENSE', category: 'Equipment', description: 'New monitor purchase', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 2, 8) },
    { amount: 1800, type: 'INCOME', category: 'Freelance', description: 'Logo design project', userId: analyst.id, date: new Date(now.getFullYear(), now.getMonth() - 2, 20) },

    // 3 months ago
    { amount: 8500, type: 'INCOME', category: 'Salary', description: 'Monthly salary - January', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 3, 1) },
    { amount: 1200, type: 'EXPENSE', category: 'Rent', description: 'Office space rent', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 3, 2) },
    { amount: 5000, type: 'INCOME', category: 'Bonus', description: 'Annual performance bonus', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 3, 15) },
    { amount: 220, type: 'EXPENSE', category: 'Food', description: 'Team dinner celebration', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 3, 16) },

    // 4 months ago
    { amount: 8500, type: 'INCOME', category: 'Salary', description: 'Monthly salary - December', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 4, 1) },
    { amount: 2200, type: 'EXPENSE', category: 'Equipment', description: 'MacBook Pro upgrade', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 4, 10) },
    { amount: 400, type: 'EXPENSE', category: 'Transport', description: 'Monthly metro pass', userId: analyst.id, date: new Date(now.getFullYear(), now.getMonth() - 4, 5) },

    // 5 months ago
    { amount: 8500, type: 'INCOME', category: 'Salary', description: 'Monthly salary - November', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
    { amount: 1200, type: 'EXPENSE', category: 'Rent', description: 'Office space rent', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 5, 2) },
    { amount: 1500, type: 'INCOME', category: 'Freelance', description: 'Website redesign project', userId: analyst.id, date: new Date(now.getFullYear(), now.getMonth() - 5, 18) },
    { amount: 300, type: 'EXPENSE', category: 'Subscriptions', description: 'AWS hosting + tools', userId: admin.id, date: new Date(now.getFullYear(), now.getMonth() - 5, 20) },
  ];

  await prisma.financialRecord.createMany({ data: records });
  console.log(`✅ Created ${records.length} financial records\n`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:   admin@vaultflow.com / admin123');
  console.log('   Analyst: analyst@vaultflow.com / admin123');
  console.log('   Viewer:  viewer@vaultflow.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
