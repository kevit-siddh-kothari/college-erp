"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudent = exports.deleteAllStudents = exports.deleteStudentById = exports.updateStudentById = exports.addStudent = void 0;
const student_1 = require("../module/student");
const department_1 = require("../../department/module/department");
const attendance_1 = require("../../attendance/module/attendance");
/**
 * Handles getting all student.
 *
 * @param {Request} req - Express request object containing the student data in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const getAllStudent = async (req, res) => {
    try {
        // Fetch all students from the database
        const students = await student_1.Student.find({});
        res.status(200).json(students);
    }
    catch (error) {
        console.error(`Error fetching students: ${error.message}`);
        res.status(404).json({ error: 'Internal Server Error' });
    }
};
exports.getAllStudent = getAllStudent;
/**
 * Handles adding a new student.
 *
 * @param {Request} req - Express request object containing the student data in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const addStudent = async (req, res) => {
    try {
        const { name, phno, departmentname, batch, currentsem } = req.body;
        const departmenId = await department_1.Department.findOne({ departmentname }, { _id: 1 });
        if (!departmenId) {
            throw new Error(`No department with name ${departmentname} exists`);
        }
        const student = new student_1.Student({
            name,
            phno,
            department: departmenId,
            batch,
            currentsem
        });
        await student.save();
        const data = new attendance_1.Attendance({ student: student._id, department: student.department });
        await data.save();
        res.status(201).send(`student created sucessfully with default present attendance`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.addStudent = addStudent;
/**
 * Handles updating an existing student.
 *
 * @param {Request} req - Express request object containing the student data in the body and the student ID in the URL params.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const updateStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await student_1.Student.findOne({ _id: id });
        if (!student) {
            throw new Error(`no student esixts bu this id ${id}`);
        }
        const body = req.body;
        for (let a in body) {
            student[a] = body[a];
        }
        await student.save();
        res.send("task Updated sucessfully");
    }
    catch (error) {
        res.status(400).send(error);
    }
};
exports.updateStudentById = updateStudentById;
/**
 * Handles deleting a specific student.
 *
 * @param {Request} req - Express request object containing the student ID in the URL params.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const deleteStudentById = async (req, res) => {
    // Your implementation here
    try {
        const { id } = req.params;
        const student = await student_1.Student.findOne({ _id: id });
        if (!student) {
            throw new Error(`no student esixts with this id ${id}`);
        }
        await student_1.Student.deleteOne({ _id: student._id });
        await attendance_1.Attendance.deleteMany({ student: student._id });
        res.send(`student deleted sucessfully!`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.deleteStudentById = deleteStudentById;
/**
 * Handles deleting all students.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const deleteAllStudents = async (req, res) => {
    try {
        await student_1.Student.deleteMany({});
        await attendance_1.Attendance.deleteMany({});
        res.send(`All students data is cleared`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.deleteAllStudents = deleteAllStudents;
