"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizationAdmin = async (req, res, next) => {
    if (req.user?.role === 'admin') {
        next();
    }
    res.send(`Only admins are authrnticated to this routes !`);
};
module.exports = { authorizationAdmin };
