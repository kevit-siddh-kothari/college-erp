"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationStudent = void 0;
const authorizationStudent = async (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            console.log('hell');
            return next();
        }
        res.status(403).send(`only students are authorized to this path !`);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.authorizationStudent = authorizationStudent;
