// src/services/finance.service.js
import prisma from '../prisma.js';
import AppError from '../utils/AppError.js';

const getAllRecords = async (filter = {}, user) => {
  const { category, type, startDate, endDate, search, page = 1, limit = 20 } = filter;

  const where = { isDeleted: false };

  if (category) where.category = category;
  if (type) where.type = type;

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  // Search support across description and category
  if (search) {
    where.OR = [
      { description: { contains: search } },
      { category: { contains: search } },
    ];
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [records, totalCount] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.financialRecord.count({ where })
  ]);

  return {
    records,
    pagination: {
      page: parseInt(page),
      limit: take,
      totalCount,
      totalPages: Math.ceil(totalCount / take),
    }
  };
};

const createRecord = async (recordData, userId) => {
  return await prisma.financialRecord.create({
    data: {
      ...recordData,
      date: recordData.date ? new Date(recordData.date) : new Date(),
      userId
    }
  });
};

const updateRecord = async (id, recordData) => {
  const record = await prisma.financialRecord.findUnique({ where: { id } });
  if (!record || record.isDeleted) throw new AppError('Record not found', 404);

  return await prisma.financialRecord.update({
    where: { id },
    data: {
      ...recordData,
      date: recordData.date ? new Date(recordData.date) : record.date
    }
  });
};

const deleteRecord = async (id) => {
  const record = await prisma.financialRecord.findUnique({ where: { id } });
  if (!record || record.isDeleted) throw new AppError('Record not found', 404);

  // Soft delete instead of hard delete
  return await prisma.financialRecord.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    }
  });
};

const getSummary = async () => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false }
  });

  const totalIncome = records
    .filter(r => r.type === 'INCOME')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = records
    .filter(r => r.type === 'EXPENSE')
    .reduce((sum, r) => sum + r.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Category-wise totals as array for charts
  const categoryMap = {};
  records.forEach(r => {
    if (!categoryMap[r.category]) {
      categoryMap[r.category] = { income: 0, expense: 0, total: 0 };
    }
    if (r.type === 'INCOME') {
      categoryMap[r.category].income += r.amount;
      categoryMap[r.category].total += r.amount;
    } else {
      categoryMap[r.category].expense += r.amount;
      categoryMap[r.category].total -= r.amount;
    }
  });

  const categorySummary = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    income: data.income,
    expense: data.expense,
    net: data.total,
    _sum: { amount: data.income + data.expense }
  }));

  // Monthly trends (last 6 months)
  const now = new Date();
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const monthName = monthStart.toLocaleString('default', { month: 'short' });

    const monthRecords = records.filter(r => {
      const d = new Date(r.date);
      return d >= monthStart && d <= monthEnd;
    });

    const income = monthRecords.filter(r => r.type === 'INCOME').reduce((s, r) => s + r.amount, 0);
    const expense = monthRecords.filter(r => r.type === 'EXPENSE').reduce((s, r) => s + r.amount, 0);

    monthlyTrends.push({ month: monthName, income, expense, net: income - expense });
  }

  // Recent activity (last 5)
  const recentActivity = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    take: 5,
    orderBy: { date: 'desc' },
    include: { user: { select: { name: true } } }
  });

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categorySummary,
    monthlyTrends,
    recentActivity,
    recordCount: records.length,
  };
};

export default {
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getSummary
};
