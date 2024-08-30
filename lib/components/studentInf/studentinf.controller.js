"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.student = void 0;
const student_module_1 = require("../student/student.module");
class StudentInfoController {
    async studentInf(req, res) {
        try {
            console.log('hey');
            const { username } = req.params;
            console.log(username);
            if (req.user?.username === username) {
                const student = await student_module_1.Student.find({ username }).populate('department').populate('batch');
                return res.send(student);
            }
            else {
                return res.status(403).send(`you are not authorized student !`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}
exports.student = new StudentInfoController();
