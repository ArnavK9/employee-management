const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: [2, 'Name must be at least 2 characters'] },
    email: {
      type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
      match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Invalid email format'],
    },
    department: { type: String, required: [true, 'Department is required'], trim: true },
    designation: { type: String, required: [true, 'Designation is required'], trim: true },
    salary: { type: Number, required: [true, 'Salary is required'], min: [1, 'Salary must be a positive number'] },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Employee', employeeSchema);
