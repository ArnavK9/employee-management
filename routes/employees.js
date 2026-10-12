const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const router = express.Router();

// Reject malformed IDs before they reach the database
const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }
  next();
};

// CREATE  - POST /api/employees
router.post('/', async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) { next(err); }
});

// READ ALL - GET /api/employees
router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Employee.find().sort({ createdAt: 1 }));
  } catch (err) { next(err); }
});

// READ ONE - GET /api/employees/:id
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) { next(err); }
});

// UPDATE - PUT /api/employees/:id
router.put('/:id', validateId, async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,            // return the updated document
      runValidators: true,  // apply schema validation on update
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) { next(err); }
});

// DELETE - DELETE /api/employees/:id
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
