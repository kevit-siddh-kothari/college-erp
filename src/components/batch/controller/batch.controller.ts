import { Request, Response } from 'express';
import { Batch, IBatch } from '../module/batch';

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
    const batchData = JSON.parse(req.body);
    console.log(batchData);
    const batch = new Batch({ year: batchData[0].year, branches: batchData[0].branches });
    await batch.save();
    res.send(`batch created sucessfully`);
  } catch (error: any) {
    res.send(error.message);
  }
};

export { getBatch, addBatch };
