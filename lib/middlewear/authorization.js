"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationAdmin = void 0;
const authorizationAdmin = async (req, res, next) => {
    try {
        console.log(req.user?.role);
        if (req.user?.role === 'admin') {
            return next();
        }
        throw new Error(`only admins are authorized to this path !`);
    }
    catch (error) {
        res.status(401).send(error.message);
    }
};
exports.authorizationAdmin = authorizationAdmin;
