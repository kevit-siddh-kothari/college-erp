import { Attendance, IAttendance } from './attendance.module';
import { Request, Response } from 'express';
import {logger} from '../../utils/winstone.logger'; // Import the logger

class AttendanceController {
  /**
   * Get all student attendance records.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} - Returns a promise that resolves to any.
   * @throws {Error} - Throws an error if there is an issue fetching the data.
   */
  public async getAllStudentAttendance(req: Request, res: Response): Promise<any> {
    try {
      const data = await Attendance.find({}).populate('student').lean();
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Failed to get student attendance records: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Add a new attendance record for a student.
   *
   * @param {Request} req - The request object containing student ID and attendance status.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} - Returns a promise that resolves to any.
   * @throws {Error} - Throws an error if there is an issue saving the data.
   */
  public async addAttendance(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { isPresent } = req.body;
      const attendance = new Attendance({ student: id, isPresent });
      await attendance.save();
      res.status(201).json({ message: 'Attendance created successfully' });
    } catch (error: any) {

      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update an existing attendance record for a student on a specific date.
   *
   * @param {Request} req - The request object containing student ID, date, and updated attendance data.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} - Returns a promise that resolves to any.
   * @throws {Error} - Throws an error if the attendance record is not found or if there is an issue saving the data.
   */
  public async updateAttendance(req: Request, res: Response): Promise<any> {
    try {
      const { id, date } = req.params;
      const data: IAttendance | null = await Attendance.findOne({ student: id, createdAt: date });
      if (!data) {
        return res.status(404).json({ error: `No attendance record found for student with ID: ${id} on ${date}` });
      }
      const body = req.body;
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          data[key] = body[key];
        }
      }
      await data.save();
      res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the controller as an instance
export const attendanceController = new AttendanceController();
