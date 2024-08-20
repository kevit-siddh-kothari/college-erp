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
const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const data: IAttendance | null = await Attendance.findOne({ student: id }, { present: 1, absent: 1 });
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

export { updateAttendance, getAllStudentAttendance };
