import { Request, Response } from 'express';
import { Department, IDepartment } from './department.module';
import { Student } from '../student/student.module';
import { Attendance } from '../attendance/attendance.module';
import { IUser } from '../user/user.module';
import { validationResult } from 'express-validator';
import {logger} from '../../utils/winstone.logger'; // Import the logger

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

class DepartmentController {
  public async getAllDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const departments: IDepartment[] = await Department.find({});
      res.status(200).json(departments);
    } catch (error: any) {
      logger.error(`Failed to get departments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async addDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const department = new Department({ departmentname: req.body.departmentname });
      await department.save();
      res.status(201).json({ message: 'Department created successfully' });
    } catch (error: any) {
      logger.error(`Failed to add department: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async updateDepartmentById(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const department: IDepartment | null = await Department.findById(id);
      if (!department) {
        return res.status(404).json({ error: `No department with ID ${id} exists in the database` });
      }
      const body: Partial<IDepartment> = req.body;
      for (const key in body) {
          department[key] = body[key];
      }
      await department.save();
      res.status(200).json({ message: 'Department updated successfully' });
    } catch (error: any) {
      logger.error(`Failed to update department with ID ${req.params.id}: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteDepartmentById(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const department: IDepartment | null = await Department.findById(id);
      if (!department) {
        return res.status(404).json({ error: `No department with ID ${id} found` });
      }
      await Attendance.deleteMany({ department: id });
      await Student.deleteMany({ department: id });
      await Department.deleteOne({ _id: id });
      res.status(200).json({
        message: `Department with ID ${id} deleted successfully along with associated students and attendance records.`,
      });
    } catch (error: any) {
      logger.error(`Failed to delete department with ID ${req.params.id}: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteAllDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      await Attendance.deleteMany({});
      await Department.deleteMany({});
      await Student.deleteMany({});
      res.status(200).json({ message: 'All departments, students, and attendance records deleted successfully' });
    } catch (error: any) {
      logger.error(`Failed to delete all departments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the controller as an instance
export const departmentController = new DepartmentController();
