"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchController = void 0;
const batch_module_1 = require("../module/batch.module");
const department_module_1 = require("../../department/module/department.module");
class BatchController {
    /**
     * Get all batches.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<any>} - Returns a promise that resolves to any.
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
     * @returns {Promise<any>} - Returns a promise that resolves to any.
     * @throws {Error} - Throws an error if there is an issue saving the data.
     */
    async addBatch(req, res) {
        try {
            const departmentId = await department_module_1.Department.findOne({ departmentname: req.body.department });
            if (!departmentId) {
                return res.status(404).json({ error: `no department exist with name ${departmentId}` });
            }
            const checkForExistingBatch = await batch_module_1.Batch.findOne({ year: req.body.year });
            if (checkForExistingBatch) {
                const newBranch = {
                    departmentId: departmentId._id,
                    totalStudentsIntake: req.body.totalStudentsIntake,
                    availableSeats: req.body.availableSeats,
                    occupiedSeats: req.body.occupiedSeats,
                };
                await batch_module_1.Batch.updateOne({
                    year: req.body.year,
                    'branches.departmentId': newBranch.departmentId, // Match by departmentId
                }, {
                    $set: {
                        'branches.$': newBranch, // Update existing branch
                    },
                });
                // If no branch was updated (i.e., branch with departmentId was not found), push a new branch
                await batch_module_1.Batch.updateOne({
                    year: req.body.year,
                    'branches.departmentId': { $ne: newBranch.departmentId }, // Ensure the branch doesn't exist
                }, {
                    $push: { branches: newBranch }, // Push the new branch
                });
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
            await batch_module_1.Batch.create(batchData);
            res.send('Batch created successfully!');
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}
// Export the controller as an instance
exports.batchController = new BatchController();
