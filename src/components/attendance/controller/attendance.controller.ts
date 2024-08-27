import { Attendance, IAttendance } from '../module/attendance.module';
import { Request, Response } from 'express';

class AttendanceController {
  /**
   * Get all student attendance records.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   * @throws {Error} - Throws an error if there is an issue fetching the data.
   */
  public async getAllStudentAttendance(req: Request, res: Response): Promise<void> {
    try {
      const data = await Attendance.find({}).populate('student').lean();
      res.send(data);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  /**
   * Add a new attendance record for a student.
   *
   * @param {Request} req - The request object containing student ID and attendance status.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   * @throws {Error} - Throws an error if there is an issue saving the data.
   */
  public async addAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isPresent } = req.body;
      const attendance = new Attendance({ student: id, isPresent });
      await attendance.save();
      res.send('Attendance created successfully');
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  /**
   * Update an existing attendance record for a student on a specific date.
   *
   * @param {Request} req - The request object containing student ID, date, and updated attendance data.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   * @throws {Error} - Throws an error if the attendance record is not found or if there is an issue saving the data.
   */
  public async updateAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id, date } = req.params;
      const data: IAttendance | null = await Attendance.findOne({ student: id, createdAt: date });
      if (!data) {
        throw new Error(`No attendance record found for student with ID: ${id} on ${date}`);
      }
      const body = req.body;
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          data[key] = body[key];
        }
      }
      await data.save();
      res.send('Attendance updated successfully');
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
}

// Export the controller as an instance
export const attendanceController = new AttendanceController();
