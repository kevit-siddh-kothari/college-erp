"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBatch = exports.getBatch = void 0;
const batch_1 = require("../module/batch");
const getBatch = async (req, res) => {
    try {
        const batch = await batch_1.Batch.find({}).lean();
        res.send(batch);
    }
    catch (error) {
        res.send(error.message);
    }
};
exports.getBatch = getBatch;
const addBatch = async (req, res) => {
    try {
        const batchData = JSON.parse(req.body);
        console.log(batchData);
        const batch = new batch_1.Batch({ year: batchData[0].year, branches: batchData[0].branches });
        await batch.save();
        res.send(`batch created sucessfully`);
    }
    catch (error) {
        res.send(error.message);
    }
};
exports.addBatch = addBatch;
