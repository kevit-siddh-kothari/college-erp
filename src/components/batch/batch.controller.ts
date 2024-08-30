import { Request, Response } from 'express';
import { Batch, IBatch } from './batch.module';
import { Department, IDepartment } from '../department/department.module';
import { validationResult } from 'express-validator';

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
   * @returns {Promise<any>} - Returns a promise that resolves to any.
   * @throws {Error} - Throws an error if there is an issue saving the data.
   */
  public async addBatch(req: Request, res: Response): Promise<any> {
    try {
      const departmentId: IDepartment | null = await Department.findOne({ departmentname: req.body.department });
      if (!departmentId) {
        return res.status(404).json({error:`no department exist with name ${departmentId}`});
      }

      const checkForExistingBatch: IBatch | null = await Batch.findOne({ year: req.body.year });
      if (checkForExistingBatch) {
        const newBranch = {
          departmentId: departmentId._id,
          totalStudentsIntake: req.body.totalStudentsIntake,
          availableSeats: req.body.availableSeats,
          occupiedSeats: req.body.occupiedSeats,
        };
        await Batch.updateOne(
          {
            year:req.body.year,
            'branches.departmentId': newBranch.departmentId, // Match by departmentId
          },
          {
            $set: {
              'branches.$': newBranch, // Update existing branch
            },
          }
        );
  
        // If no branch was updated (i.e., branch with departmentId was not found), push a new branch
        await Batch.updateOne(
          {
            year:req.body.year,
            'branches.departmentId': { $ne: newBranch.departmentId }, // Ensure the branch doesn't exist
          },
          {
            $push: { branches: newBranch }, // Push the new branch
          }
        );
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
      await Batch.create(batchData);
      res.send('Batch created successfully!');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}



// Export the controller as an instance
export const batchController = new BatchController();
