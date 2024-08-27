"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllDepartment = exports.deleteDepartmentById = exports.updateDepartmentById = exports.addDepartment = exports.getAllDepartment = void 0;
const department_1 = require("../module/department");
const student_1 = require("../../student/module/student");
const attendance_1 = require("../../attendance/module/attendance");
const express_validator_1 = require("express-validator");
/**
 * Retrieves all departments from the database.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const getAllDepartment = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new Error('You are authenticated but not authorized for department controls!');
        }
        const departments = await department_1.Department.find({});
        res.status(200).send(departments);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.getAllDepartment = getAllDepartment;
/**
 * Adds a new department to the database.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const addDepartment = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            // Throw an error with the validation errors
            throw new Error(JSON.stringify({ errors: errors.array() }));
        }
        const department = new department_1.Department({ departmentname: req.body.departmentname });
        await department.save();
        res.send('Department created successfully');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.addDepartment = addDepartment;
/**
 * Updates an existing department by ID.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const updateDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await department_1.Department.findById(id);
        if (!department) {
            throw new Error(`No department with ID ${id} exists in the database`);
        }
        const body = req.body;
        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                department[key] = body[key];
            }
        }
        await department.save();
        res.send('Department updated successfully');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.updateDepartmentById = updateDepartmentById;
/**
 * Deletes an existing department by ID.
 * Also deletes associated students and attendance records.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const deleteDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await department_1.Department.findById(id);
        if (!department) {
            throw new Error(`No department with ID ${id} exists in the database`);
        }
        await attendance_1.Attendance.deleteMany({ department: id });
        await student_1.Student.deleteMany({ department: id });
        await department_1.Department.deleteOne({ _id: id });
        res.send(`Department with ID ${id} deleted successfully along with associated students and attendance records.`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.deleteDepartmentById = deleteDepartmentById;
/**
 * Deletes all departments, students, and attendance records from the database.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const deleteAllDepartment = async (req, res) => {
    try {
        await attendance_1.Attendance.deleteMany({});
        await department_1.Department.deleteMany({});
        await student_1.Student.deleteMany({});
        res.status(200).send('All departments, students, and attendance records deleted successfully');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.deleteAllDepartment = deleteAllDepartment;
