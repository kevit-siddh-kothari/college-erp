import { Attendance, IAttendance } from '../module/attendance';
import { Request, Response } from 'express';

const getAllStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Attendance.find({}).populate('student').lean();
    res.send(data);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

const addAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isPresent } = req.body;
    const attendance = new Attendance({ student: id, isPresent });
    await attendance.save();
    res.send(`Attendance created sucessfully`);
  } catch (error: any) {
    res.send(error.message);
  }
};

const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, date } = req.params;
    const data: IAttendance | null = await Attendance.findOne({ student: id, createdAt: date });
    if (!data) {
      throw new Error(`No students exist on given ${id}`);
    }
    const body = req.body;
    for (let a in body) {
      data[a] = body[a];
    }
    await data.save();
    res.send(`attendance updated sucessfully`);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export { updateAttendance, getAllStudentAttendance, addAttendance };
