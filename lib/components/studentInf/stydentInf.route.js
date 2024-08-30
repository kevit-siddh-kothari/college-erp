"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentInfRouter = void 0;
const express_1 = require("express");
const studentinf_controller_1 = require("./studentinf.controller");
const studentInfRouter = (0, express_1.Router)();
exports.studentInfRouter = studentInfRouter;
studentInfRouter.get('/getInformation/:username', studentinf_controller_1.student.studentInf);
