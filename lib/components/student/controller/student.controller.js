"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVacantSeats = exports.getAnalyticsData = exports.getAbsentStudents = exports.getAllStudent = exports.deleteAllStudents = exports.deleteStudentById = exports.presentLessThan75 = exports.updateStudentById = exports.addStudent = void 0;
const student_1 = require("../module/student");
const department_1 = require("../../department/module/department");
const attendance_1 = require("../../attendance/module/attendance");
const batch_1 = require("../../batch/module/batch");
const express_validator_1 = require("express-validator");
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
        // const { name, phno, departmentname, batch, currentsem } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            // Throw an error with the validation errors
            throw new Error(JSON.stringify({ errors: errors.array() }));
        }
        const departmenId = await department_1.Department.findOne({ departmentname: req.body.departmentname }, { _id: 1 });
        if (!departmenId) {
            throw new Error(`No department with name ${req.body.departmentname} exists`);
        }
        console.log(departmenId);
        //for checking the avaibaility of student entry in database
        const batchData = await batch_1.Batch.find({ year: req.body.batch }, { branches: 1, _id: 0 }).lean();
        if (batchData.length === 0) {
            throw new Error(`no batch exist in the year ${req.body.batch}`);
        }
        batchData.forEach((item) => {
            console.log(`hey1`);
            item.branches.forEach((branch) => {
                if (branch.departmentId._id.equals(departmenId._id)) {
                    if (branch.availableSeats <= 0) {
                        throw new Error(`no more entries`);
                    }
                }
            });
        });
        const student = new student_1.Student({
            name: req.body.name,
            phno: req.body.phno,
            department: departmenId,
            batch: req.body.batch,
            currentsem: req.body.currentsem,
        });
        await student.save();
        await batch_1.Batch.updateOne({ 'year': req.body.batch, 'branches.departmentId': departmenId._id }, { $inc: { 'branches.$.availableSeats': -1, 'branches.$.occupiedSeats': 1 } });
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
        res.send('task Updated sucessfully');
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
        await batch_1.Batch.updateOne({ 'year': student.batch, 'branches.name': student.department }, { $inc: { 'branches.$.availableSeats': 1, 'branches.$.occupiedSeats': -1 } });
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
/**
 * Get the list of absent students for a specific date, optionally filtering by batch, branch, and current semester.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves to sending a response to the client
 *
 * @throws {Error} - Throws an error if any issue occurs during the database operations
 */
const getAbsentStudents = async (req, res) => {
    try {
        const { date } = req.params;
        const { batch, branch, currentsem } = req.query;
        const startDay = new Date(date);
        startDay.setUTCHours(0, 0, 0, 0);
        const endDay = new Date(date);
        endDay.setUTCHours(23, 59, 59, 999);
        // Ensure that the date parameter is provided
        if (!date) {
            res.status(400).json({ error: 'Date parameter is required.' });
            return;
        }
        // Initialize the branchId as unknown
        let branchId;
        // If branch is provided, find the corresponding department ID
        if (branch) {
            const department = await department_1.Department.findOne({ departmentname: branch }, { _id: 1 }).lean();
            if (!department) {
                res.status(404).json({ error: `Branch '${branch}' not found.` });
                return;
            }
            branchId = department._id;
        }
        // Fetch attendance records for the specific date
        const attendanceRecords = await attendance_1.Attendance.find({ createdAt: { $gte: startDay, $lte: endDay } }, { student: 1, _id: 0, isPresent: 1 })
            .populate('student', 'batch currentsem department')
            .lean();
        if (!attendanceRecords.length) {
            res.status(404).json({ error: `No attendance records found for the date '${date}'.` });
            return;
        }
        // Filter attendance records based on optional query parameters
        const filteredStudents = attendanceRecords.filter((record) => {
            const student = record.student;
            const matchBatch = batch ? student.batch === Number(batch) : true;
            const matchBranch = branch ? String(student.department) === String(branchId) : true;
            const matchCurrentsem = currentsem ? student.currentsem === Number(currentsem) : true;
            return matchBatch && matchBranch && matchCurrentsem;
        });
        if (!filteredStudents.length) {
            res.status(404).json({ error: 'No matching students found based on the provided criteria.' });
            return;
        }
        // Send the filtered list of absent students as response
        res.status(200).json(filteredStudents);
    }
    catch (error) {
        // Log the error and send a generic error message
        console.error('Error fetching absent students:', error);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
};
exports.getAbsentStudents = getAbsentStudents;
const presentLessThan75 = async (req, res) => {
    const { branch, batch, currentsem } = req.query;
    const attendance = await attendance_1.Attendance.aggregate([
        // Stage 1: Lookup to populate student details
        {
            $lookup: {
                from: 'students', // The collection to join with
                localField: 'student', // The field from the input documents
                foreignField: '_id', // The field from the student collection
                as: 'studentInfo', // Name of the new array field to add
            },
        },
        // Stage 2: Unwind the studentInfo array to get student details in each document
        {
            $unwind: '$studentInfo',
        },
        // Stage 3: Group by student and calculate total presence
        {
            $group: {
                _id: '$studentInfo', // Group by studentInfo after population
                TotalPresent: {
                    $sum: { $cond: { if: { $eq: ['$isPresent', true] }, then: 1, else: 0 } },
                },
            },
        }
    ]);
    let branchId;
    if (branch) {
        const department = await department_1.Department.findOne({ departmentname: branch }, { _id: 1 }).lean();
        if (!department) {
            res.status(404).json({ error: `Branch '${branch}' not found.` });
            return;
        }
        branchId = department._id;
    }
    const data = [];
    const filteredStudents = attendance.filter(record => {
        if (record.TotalPresent < 23) {
            const student = record._id;
            const matchBatch = batch ? student.batch === Number(batch) : true;
            const matchBranch = branch ? String(student.department) === String(branchId) : true;
            const matchCurrentsem = currentsem ? student.currentsem === Number(currentsem) : true;
            return matchBatch && matchBranch && matchCurrentsem;
        }
    });
    res.send(filteredStudents);
};
exports.presentLessThan75 = presentLessThan75;
const getAnalyticsData = async (req, res) => {
    const analyticsData = await student_1.Student.aggregate([
        // Stage 1: Lookup to populate department details
        {
            $lookup: {
                from: 'departments', // The collection to join with
                localField: 'department', // Field from the input documents
                foreignField: '_id', // Field from the documents of the "departments" collection
                as: 'departmentInfo', // Name of the new array field to add
            },
        },
        // Stage 2: Unwind the departmentInfo array to get department details in each document
        {
            $unwind: {
                path: '$departmentInfo',
                preserveNullAndEmptyArrays: false,
            },
        },
        // Stage 3: Group by year and department to count total students per branch
        {
            $group: {
                _id: {
                    year: '$batch',
                    branch: '$departmentInfo.departmentname', // Adjust this field based on department structure
                },
                totalStudents: { $sum: 1 },
            },
        },
        // Stage 4: Group by year and aggregate branch counts
        {
            $group: {
                _id: '$_id.year',
                totalStudents: { $sum: '$totalStudents' },
                branches: {
                    $push: {
                        k: '$_id.branch',
                        v: '$totalStudents',
                    },
                },
            },
        },
        // Stage 5: Convert branch array to an object
        {
            $project: {
                _id: 0,
                year: '$_id',
                totalStudents: 1,
                branches: {
                    $arrayToObject: {
                        $map: {
                            input: '$branches',
                            as: 'branch',
                            in: {
                                k: '$$branch.k',
                                v: '$$branch.v',
                            },
                        },
                    },
                },
            },
        },
        // Stage 6: Sort by year (optional)
        {
            $sort: {
                year: 1,
            },
        },
    ]);
    console.log(analyticsData);
    res.send(analyticsData);
};
exports.getAnalyticsData = getAnalyticsData;
const getVacantSeats = async (req, res) => {
    try {
        const { batch, branch } = req.query;
        const departmentId = await department_1.Department.findOne({ departmentname: branch }, { _id: 1 });
        let arr = [];
        let query = {};
        if (batch) {
            query.year = Number(batch);
        }
        if (branch && departmentId) {
            query['branches'] = { $elemMatch: { departmentId: departmentId._id } };
        }
        console.log(query);
        const batchData = await batch_1.Batch.find(query).lean();
        if (!batchData.length) {
            throw new Error(`no output for specified year ${batch}`);
        }
        for (let batch = 0; batch < batchData.length; batch++) {
            let batchobj = {};
            batchobj.year = batchData[batch].year;
            batchobj.totalStudents = await student_1.Student.find().countDocuments();
            let intake = 0;
            let avaibaility = 0;
            for (let a of batchData[batch].branches) {
                intake += a.totalStudentsIntake;
                avaibaility += a.availableSeats;
            }
            batchobj.totalStudentsIntake = intake;
            batchobj.availableIntake = avaibaility;
            batchobj.branches = batchData[batch].branches;
            arr.push(batchobj);
        }
        res.send(arr);
    }
    catch (error) {
        res.send(error.message);
    }
};
exports.getVacantSeats = getVacantSeats;
