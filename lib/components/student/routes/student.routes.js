"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRouter = void 0;
const express_1 = require("express");
const validator = __importStar(require("express-validator"));
const student_controller_1 = require("../controller/student.controller");
const auth_1 = require("../../../middlewear/auth");
const studentRouter = (0, express_1.Router)();
exports.studentRouter = studentRouter;
studentRouter.get('/all-students', auth_1.authentication, student_controller_1.studentController.getAllStudent);
studentRouter.get('/getanalytics', auth_1.authentication, student_controller_1.studentController.getAnalyticsData);
studentRouter.get('/vacantseats', auth_1.authentication, student_controller_1.studentController.getVacantSeats);
studentRouter.get('/presentlessthan75', auth_1.authentication, student_controller_1.studentController.presentLessThan75);
studentRouter.get('/absent/:date', auth_1.authentication, student_controller_1.studentController.getAbsentStudents);
studentRouter.post('/add-student', auth_1.authentication, validator.body('name').notEmpty().withMessage('name is required'), validator.body('phno').notEmpty().withMessage('phone number is required'), validator.body('departmentname').notEmpty().withMessage('department is required'), validator.body('batch').notEmpty().withMessage('batch is required'), validator.body('currentsem').notEmpty().withMessage('current semeater is required'), student_controller_1.studentController.addStudent);
studentRouter.put('/update-student/:id', auth_1.authentication, student_controller_1.studentController.updateStudentById);
studentRouter.delete('/delete-student/:id', auth_1.authentication, student_controller_1.studentController.deleteStudentById);
studentRouter.delete('/deleteall-students', auth_1.authentication, student_controller_1.studentController.deleteAllStudents);
