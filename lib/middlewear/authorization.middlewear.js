"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationAdmin = void 0;
const authorizationAdmin = async (req, res, next) => {
    try {
        if (req.user?.role === 'admin') {
            return next();
        }
        res.status(403).send(`only admins are authorized to this path !`);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.authorizationAdmin = authorizationAdmin;
