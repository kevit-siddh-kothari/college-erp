import { Request, Response } from 'express';
import { Batch, IBatch } from '../module/batch';
import { Department, IDepartment } from '../../department/module/department';

const getBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const batch = await Batch.find({}).lean();
    res.send(batch);
  } catch (error: any) {
    res.send(error.message);
  }
};

const addBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, department, availableSeats, occupiedSeats, totalStudentsIntake } = req.body;
    const departmentId: IDepartment | null = await Department.findOne({ departmentname: department });
    if (!departmentId) {
      throw new Error(`no department exists with name ${department}`);
    }
    const checkForExistingBatch: IBatch | null = await Batch.findOne({ year: year });
    if (checkForExistingBatch) {
      const newBranch = {
        departmentId: departmentId._id,
        totalStudentsIntake: totalStudentsIntake,
        availableSeats: availableSeats,
        occupiedSeats: occupiedSeats,
      };
      await Batch.updateOne({ year: year }, { $push: { branches: newBranch } });
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
    await Batch.insertMany(batchData);
    res.send(`batch created sucessfully ! `);
  } catch (error: any) {
    res.send(error.message);
  }
};

export { getBatch, addBatch };
