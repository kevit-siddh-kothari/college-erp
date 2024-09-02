import { Request, Response } from 'express';
import { IDepartment } from '../department/department.module';
import { logger } from '../../utils/winstone.logger';
import { batchDAL } from './batch.DAL';  // Import the DAL

class BatchController {
  public async getBatch(req: Request, res: Response): Promise<any> {
    try {
      const batch = await batchDAL.getAllBatches();  // Use DAL method
      res.status(200).json(batch);
    } catch (error: any) {
      logger.error(`Failed to get batches: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  public async addBatch(req: Request, res: Response): Promise<any> {
    try {
      const department = await batchDAL.findDepartmentById(req.body.department);  // Use DAL method
      if (!department) {
        return res.status(404).json({ error: `No department exists with name ${req.body.department}` });
      }

      const existingBatch = await batchDAL.findBatchByYear(req.body.year);  // Use DAL method
      if (existingBatch) {
        const newBranch: any = {
          departmentId: department._id,
          totalStudentsIntake: req.body.totalStudentsIntake,
          availableSeats: req.body.availableSeats,
          occupiedSeats: req.body.occupiedSeats,
        };
        await batchDAL.updateBatch(req.body.year, newBranch.departmentId, newBranch);  // Use DAL method
        await batchDAL.addBranchToBatch(req.body.year, newBranch);  // Use DAL method

        res.status(200).json({ message: 'Batch data updated successfully' });
        return;
      }

      const batchData: any = [
        {
          year: req.body.year,
          branches: [
            {
              departmentId: department._id,
              totalStudentsIntake: req.body.totalStudentsIntake,
              availableSeats: req.body.availableSeats,
              occupiedSeats: req.body.occupiedSeats,
            },
          ],
        },
      ];
      await batchDAL.createBatch(batchData);  // Use DAL method
      res.status(201).json({ message: 'Batch created successfully!' });
    } catch (error: any) {
      logger.error(`Failed to add or update batch: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the controller as an instance
export const batchController = new BatchController();
