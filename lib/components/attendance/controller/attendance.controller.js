"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudentAttendance = exports.updateAttendance = void 0;
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
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const data = await attendance_1.Attendance.findOne({ student: id }, { present: 1, absent: 1 });
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
