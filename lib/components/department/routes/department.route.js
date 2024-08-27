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
exports.departmentRouter = void 0;
const express_1 = require("express");
const validator = __importStar(require("express-validator"));
const department_controller_1 = require("../controller/department.controller");
const auth_1 = require("../../../middlewear/auth");
const authorization_1 = require("../../../middlewear/authorization");
const departmentRouter = (0, express_1.Router)();
exports.departmentRouter = departmentRouter;
departmentRouter.get('/all-department', auth_1.authentication, authorization_1.authorizationAdmin, department_controller_1.departmentController.getAllDepartment);
departmentRouter.post('/add-department', auth_1.authentication, authorization_1.authorizationAdmin, validator.body('departmentname').notEmpty().withMessage(`Please enter a valid department`), department_controller_1.departmentController.addDepartment);
departmentRouter.put('/update-department/:id', auth_1.authentication, authorization_1.authorizationAdmin, department_controller_1.departmentController.updateDepartmentById);
departmentRouter.delete('/delete-department/:id', auth_1.authentication, authorization_1.authorizationAdmin, department_controller_1.departmentController.deleteDepartmentById);
departmentRouter.delete('/deleteall-department', auth_1.authentication, authorization_1.authorizationAdmin, department_controller_1.departmentController.deleteAllDepartment);
