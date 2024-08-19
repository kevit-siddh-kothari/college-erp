"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllDepartment = exports.deleteDepartmentById = exports.updateDepartmentById = exports.addDepartment = exports.getAllDepartment = void 0;
const department_1 = require("../module/department");
const student_1 = require("../../student/module/student");
const attendance_1 = require("../../attendance/module/attendance");
const getAllDepartment = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new Error(`You are authenticated but you are not authorized for department controls !`);
        }
        const departments = await department_1.Department.find({});
        res.status(200).send(departments);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.getAllDepartment = getAllDepartment;
const addDepartment = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new Error(`You are authenticated but you are not authorized for department controls !`);
        }
        const { departmentname } = req.body;
        const department = new department_1.Department({ departmentname });
        await department.save();
        res.send(`department created sucessfully`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.addDepartment = addDepartment;
const updateDepartmentById = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new Error(`You are authenticated but you are not authorized for department controls !`);
        }
        const { id } = req.params;
        const department = await department_1.Department.findById(id);
        if (!department) {
            throw new Error(`No department by this ${id} exists in database`);
        }
        const body = req.body;
        for (let a in body) {
            department[a] = body[a];
        }
        await department.save();
        res.send(`department updated sucessfully`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.updateDepartmentById = updateDepartmentById;
const deleteDepartmentById = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new Error(`You are authenticated but you are not authorized for department controls !`);
        }
        const { id } = req.params;
        const department = await department_1.Department.findById(id);
        if (!department) {
            throw new Error(`No department by this ${id} exists in database`);
        }
        await attendance_1.Attendance.deleteMany({ department: id });
        await student_1.Student.deleteMany({ department: id });
        await department_1.Department.deleteOne({ _id: id });
        res.send(`The department with ${id} deleted sucessfully and also the related student got deleted`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.deleteDepartmentById = deleteDepartmentById;
const deleteAllDepartment = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new Error(`You are authenticated but you are not authorized for department controls !`);
        }
        await attendance_1.Attendance.deleteMany({});
        await department_1.Department.deleteMany({});
        await student_1.Student.deleteMany({});
        res.status(200).send(`All departments + studdent deleted sucessfully`);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
};
exports.deleteAllDepartment = deleteAllDepartment;
