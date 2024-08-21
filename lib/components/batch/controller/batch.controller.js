"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBatch = exports.getBatch = void 0;
const batch_1 = require("../module/batch");
const department_1 = require("../../department/module/department");
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
        const { year, department, availableSeats, occupiedSeats, totalStudentsIntake } = req.body;
        const departmentId = await department_1.Department.findOne({ departmentname: department });
        if (!departmentId) {
            throw new Error(`no department exists with name ${department}`);
        }
        const checkForExistingBatch = await batch_1.Batch.findOne({ year: year });
        if (checkForExistingBatch) {
            const newBranch = {
                departmentId: departmentId._id,
                totalStudentsIntake: totalStudentsIntake,
                availableSeats: availableSeats,
                occupiedSeats: occupiedSeats,
            };
            await batch_1.Batch.updateOne({ year: year }, { $push: { branches: newBranch } });
            res.send(`batch data updated sucessfully`);
            return;
        }
        const batchData = [
            {
                year: year,
                branches: [
                    {
                        departmentId: departmentId._id,
                        totalStudentsIntake: totalStudentsIntake,
                        availableSeats: availableSeats,
                        occupiedSeats: occupiedSeats,
                    },
                ],
            },
        ];
        await batch_1.Batch.insertMany(batchData);
        res.send(`batch created sucessfully ! `);
    }
    catch (error) {
        res.send(error.message);
    }
};
exports.addBatch = addBatch;
