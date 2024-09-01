import { Request, Response } from 'express';
import { Batch, IBatch } from './batch.module';
import { Department, IDepartment } from '../department/department.module';
import {logger} from '../../utils/winstone.logger'; // Import the logger

class BatchController {
  /**
   * Get all batches.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} - Returns a promise that resolves to any.
   * @throws {Error} - Throws an error if there is an issue fetching the data.
   */
  public async getBatch(req: Request, res: Response): Promise<any> {
    try {
      const batch = await Batch.find({}).lean();
      res.status(200).json(batch);
    } catch (error: any) {
      logger.error(`Failed to get batches: ${error.message}`);
      res.status(400).json({ error: error.message });
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
  public async addBatch(req: Request, res: Response): Promise<any> {
    try {
      const departmentId: IDepartment | null = await Department.findOne({ _id: req.body.department });
      if (!departmentId) {
        return res.status(404).json({ error: `No department exists with name ${req.body.department}` });
      }

      const checkForExistingBatch: IBatch | null = await Batch.findOne({ year: req.body.year });
      if (checkForExistingBatch) {
        const newBranch = {
          departmentId: departmentId._id,
          totalStudentsIntake: req.body.totalStudentsIntake,
          availableSeats: req.body.availableSeats,
          occupiedSeats: req.body.occupiedSeats,
        };
        const updateResult = await Batch.updateOne(
          {
            'year': req.body.year,
            'branches.departmentId': newBranch.departmentId,
          },
          {
            $set: {
              'branches.$': newBranch,
            },
          }
        );
          await Batch.updateOne(
            {
              'year': req.body.year,
              'branches.departmentId': { $ne: newBranch.departmentId },
            },
            {
              $push: { branches: newBranch },
            }
          );

        res.status(200).json({ message: 'Batch data updated successfully' });
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
      await Batch.create(batchData);
      res.status(201).json({ message: 'Batch created successfully!' });
    } catch (error: any) {
      logger.error(`Failed to add or update batch: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the controller as an instance
export const batchController = new BatchController();
