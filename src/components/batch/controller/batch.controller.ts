import { Request, Response } from 'express';
import { Batch, IBatch } from '../module/batch.module';
import { Department, IDepartment } from '../../department/module/department.module';
import { validationResult } from 'express-validator';

class BatchController {
  /**
   * Get all batches.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   * @throws {Error} - Throws an error if there is an issue fetching the data.
   */
  public async getBatch(req: Request, res: Response): Promise<void> {
    try {
      const batch = await Batch.find({}).lean();
      res.send(batch);
    } catch (error: any) {
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
  public async addBatch(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Throw an error with the validation errors
        throw new Error(JSON.stringify({ errors: errors.array() }));
      }
      const departmentId: IDepartment | null = await Department.findOne({ departmentname: req.body.department });
      if (!departmentId) {
        throw new Error(`No department exists with name ${req.body.department}`);
      }

      const checkForExistingBatch: IBatch | null = await Batch.findOne({ year: req.body.year });
      if (checkForExistingBatch) {
        const newBranch = {
          departmentId: departmentId._id,
          totalStudentsIntake: req.body.totalStudentsIntake,
          availableSeats: req.body.availableSeats,
          occupiedSeats: req.body.occupiedSeats,
        };
        await Batch.updateOne({ year: req.body.year }, { $push: { branches: newBranch } });
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
      await Batch.insertMany(batchData);
      res.send('Batch created successfully!');
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
}

// Export the controller as an instance
export const batchController = new BatchController();
