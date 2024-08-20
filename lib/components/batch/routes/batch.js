"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchRouter = void 0;
const batch_controller_1 = require("../controller/batch.controller");
const express_1 = require("express");
const batchRouter = (0, express_1.Router)();
exports.batchRouter = batchRouter;
batchRouter.post('/add-batch', batch_controller_1.addBatch);
batchRouter.get('/get-allbatch', batch_controller_1.getBatch);
