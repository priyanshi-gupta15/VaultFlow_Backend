// src/controllers/finance.controller.js
import financeService from '../services/finance.service.js';

/**
 * Retrieves all financial records with filtering and pagination.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAllRecords = async (req, res, next) => {
  try {
    const result = await financeService.getAllRecords(req.query, req.user);

    res.status(200).json({
      status: 'success',
      results: result.records.length,
      pagination: result.pagination,
      data: {
        records: result.records,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new financial record.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createRecord = async (req, res, next) => {
  try {
    const record = await financeService.createRecord(req.body, req.user.id);

    res.status(201).json({
      status: 'success',
      data: {
        record,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an existing financial record by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateRecord = async (req, res, next) => {
  try {
    const record = await financeService.updateRecord(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        record,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Soft-deletes a financial record by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteRecord = async (req, res, next) => {
  try {
    await financeService.deleteRecord(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Record soft-deleted successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generates a comprehensive financial summary for the dashboard.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getSummary = async (req, res, next) => {
  try {
    const summary = await financeService.getSummary();

    res.status(200).json({
      status: 'success',
      data: {
        summary,
      },
    });
  } catch (err) {
    next(err);
  }
};


export default {
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getSummary,
};
