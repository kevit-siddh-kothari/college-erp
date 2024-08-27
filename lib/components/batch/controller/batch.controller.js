"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchController = void 0;
const batch_module_1 = require("../module/batch.module");
const department_module_1 = require("../../department/module/department.module");
const express_validator_1 = require("express-validator");
class BatchController {
    /**
     * Get all batches.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - Returns a promise that resolves to void.
     * @throws {Error} - Throws an error if there is an issue fetching the data.
     */
    async getBatch(req, res) {
        try {
            const batch = await batch_module_1.Batch.find({}).lean();
            res.send(batch);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
    /**
     * Add or update a batch.
     *
     * @param {Request} req - The request object containing batch details.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - Returns a promise that resolves to void.
     * @throws {Error} - Throws an error if there is an issue saving the data.
     */
    async addBatch(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                // Throw an error with the validation errors
                throw new Error(JSON.stringify({ errors: errors.array() }));
            }
            const departmentId = await department_module_1.Department.findOne({ departmentname: req.body.department });
            if (!departmentId) {
                throw new Error(`No department exists with name ${req.body.department}`);
            }
            const checkForExistingBatch = await batch_module_1.Batch.findOne({ year: req.body.year });
            if (checkForExistingBatch) {
                const newBranch = {
                    departmentId: departmentId._id,
                    totalStudentsIntake: req.body.totalStudentsIntake,
                    availableSeats: req.body.availableSeats,
                    occupiedSeats: req.body.occupiedSeats,
                };
                await batch_module_1.Batch.updateOne({ year: req.body.year }, { $push: { branches: newBranch } });
                res.send('Batch data updated successfully');
                return;
            }
            const batchData = [
                {
                    year: req.body.year,
                    branches: [
                        {
                            departmentId: departmentId._id,
                            totalStudentsIntake: req.body.totalStudentsIntake,
                            availableSeats: req.body.availableSeats,
                            occupiedSeats: req.body.occupiedSeats,
                        },
                    ],
                },
            ];
            await batch_module_1.Batch.insertMany(batchData);
            res.send('Batch created successfully!');
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
}
// Export the controller as an instance
exports.batchController = new BatchController();
