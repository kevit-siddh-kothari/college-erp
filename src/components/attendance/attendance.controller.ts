import { Request, Response } from 'express';
import { attendanceDAL } from './attendance.DAL'; // Import the DAL
import { logger } from '../../utils/winstone.logger'; // Import the logger

class AttendanceController {
  public async getAllStudentAttendance(req: Request, res: Response): Promise<any> {
    try {
      const data = await attendanceDAL.getAllAttendance();
      res.status(200).json(data);
    } catch (error: any) {
      logger.error(`Failed to get student attendance records: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async addAttendance(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { isPresent } = req.body;
      const attendanceData: any = { student: id, isPresent };
      await attendanceDAL.createAttendance(attendanceData);
      res.status(201).json({ message: 'Attendance created successfully' });
    } catch (error: any) {
      logger.error(`Failed to add attendance: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async updateAttendance(req: Request, res: Response): Promise<any> {
    try {
      const { id, date } = req.params;
      const data = await attendanceDAL.findAttendanceByStudentAndDate(id, date);
      if (!data) {
        return res.status(404).json({ error: `No attendance record found for student with ID: ${id} on ${date}` });
      }
      await attendanceDAL.updateAttendance(data, req.body);
      res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error: any) {
      logger.error(`Failed to update attendance: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

export const attendanceController = new AttendanceController();
