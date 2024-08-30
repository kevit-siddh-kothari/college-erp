"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationAdminOrStaff = void 0;
const authorizationAdminOrStaff = async (req, res, next) => {
    try {
        if (req.user?.role === 'admin' || req.user?.role === 'staffmember') {
            return next();
        }
        res.status(403).send(`only admins or staffmembers are authorized to this path !`);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.authorizationAdminOrStaff = authorizationAdminOrStaff;
