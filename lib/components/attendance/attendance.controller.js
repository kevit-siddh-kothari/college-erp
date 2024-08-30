"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceController = void 0;
const attendance_module_1 = require("./attendance.module");
class AttendanceController {
    /**
     * Get all student attendance records.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<any>} - Returns a promise that resolves to any.
     * @throws {Error} - Throws an error if there is an issue fetching the data.
     */
    async getAllStudentAttendance(req, res) {
        try {
            const data = await attendance_module_1.Attendance.find({}).populate('student').lean();
            res.send(data);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
    /**
     * Add a new attendance record for a student.
     *
     * @param {Request} req - The request object containing student ID and attendance status.
     * @param {Response} res - The response object.
     * @returns {Promise<any>} - Returns a promise that resolves to any.
     * @throws {Error} - Throws an error if there is an issue saving the data.
     */
    async addAttendance(req, res) {
        try {
            const { id } = req.params;
            const { isPresent } = req.body;
            const attendance = new attendance_module_1.Attendance({ student: id, isPresent });
            await attendance.save();
            res.send('Attendance created successfully');
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
    /**
     * Update an existing attendance record for a student on a specific date.
     *
     * @param {Request} req - The request object containing student ID, date, and updated attendance data.
     * @param {Response} res - The response object.
     * @returns {Promise<any>} - Returns a promise that resolves to any.
     * @throws {Error} - Throws an error if the attendance record is not found or if there is an issue saving the data.
     */
    async updateAttendance(req, res) {
        try {
            const { id, date } = req.params;
            const data = await attendance_module_1.Attendance.findOne({ student: id, createdAt: date });
            if (!data) {
                return res.status(404).send(`No attendance record found for student with ID: ${id} on ${date}`);
            }
            const body = req.body;
            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    data[key] = body[key];
                }
            }
            await data.save();
            res.send('Attendance updated successfully');
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}
// Export the controller as an instance
exports.attendanceController = new AttendanceController();
