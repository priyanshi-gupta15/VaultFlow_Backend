// src/controllers/user.controller.js
import prisma from '../prisma.js';
import AppError from '../utils/AppError.js';

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          _count: { select: { records: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        page: parseInt(page),
        limit: take,
        totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
      data: { users }
    });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { status, role } = req.body;

    // Validate inputs
    if (status && !['ACTIVE', 'INACTIVE'].includes(status)) {
      return next(new AppError('Invalid status. Must be ACTIVE or INACTIVE.', 400));
    }
    if (role && !['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
      return next(new AppError('Invalid role. Must be VIEWER, ANALYST, or ADMIN.', 400));
    }

    // Build update data - only include fields that are provided
    const updateData = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return next(new AppError('Please provide status or role to update.', 400));
    }

    // Prevent self-demotion for safety
    if (req.params.id === req.user.id && role && role !== 'ADMIN') {
      return next(new AppError('You cannot change your own admin role.', 403));
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return next(new AppError('User not found.', 404));
    }
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return next(new AppError('You cannot delete your own account.', 403));
    }

    await prisma.user.delete({ where: { id: req.params.id } });

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: null,
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return next(new AppError('User not found.', 404));
    }
    next(err);
  }
};

export default { getAllUsers, updateUserStatus, deleteUser };
