"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAttendance = exports.getAllStudentAttendance = exports.updateAttendance = void 0;
const attendance_1 = require("../module/attendance");
const getAllStudentAttendance = async (req, res) => {
    try {
        const data = await attendance_1.Attendance.find({}).populate('student').lean();
        res.send(data);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.getAllStudentAttendance = getAllStudentAttendance;
const addAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPresent } = req.body;
        const attendance = new attendance_1.Attendance({ student: id, isPresent });
        await attendance.save();
        res.send(`Attendance created sucessfully`);
    }
    catch (error) {
        res.send(error.message);
    }
};
exports.addAttendance = addAttendance;
const updateAttendance = async (req, res) => {
    try {
        const { id, date } = req.params;
        const data = await attendance_1.Attendance.findOne({ student: id, createdAt: date });
        if (!data) {
            throw new Error(`No students exist on given ${id}`);
        }
        const body = req.body;
        for (let a in body) {
            data[a] = body[a];
        }
        await data.save();
        res.send(`attendance updated sucessfully`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.updateAttendance = updateAttendance;
