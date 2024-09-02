import { Request, Response } from 'express';
import { departmentDAL } from './department.DAL'; // Import the DAL
import { IUser } from '../user/user.module';
import { logger } from '../../utils/winstone.logger'; // Import the logger

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

class DepartmentController {
  public async getAllDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const departments = await departmentDAL.getAllDepartments();
      res.status(200).json(departments);
    } catch (error: any) {
      logger.error(`Failed to get departments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async addDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      await departmentDAL.addDepartment(req.body.departmentname);
      res.status(201).json({ message: 'Department created successfully' });
    } catch (error: any) {
      logger.error(`Failed to add department: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async updateDepartmentById(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const department = await departmentDAL.findDepartmentById(id);
      if (!department) {
        return res.status(404).json({ error: `No department with ID ${id} exists in the database` });
      }
      const updates = req.body;
      await departmentDAL.updateDepartment(department, updates);
      res.status(200).json({ message: 'Department updated successfully' });
    } catch (error: any) {
      logger.error(`Failed to update department with ID ${req.params.id}: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteDepartmentById(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const department = await departmentDAL.findDepartmentById(id);
      if (!department) {
        return res.status(404).json({ error: `No department with ID ${id} found` });
      }
      await departmentDAL.deleteDepartmentById(id);
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
      await departmentDAL.deleteAllDepartments();
      res.status(200).json({ message: 'All departments, students, and attendance records deleted successfully' });
    } catch (error: any) {
      logger.error(`Failed to delete all departments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the controller as an instance
export const departmentController = new DepartmentController();
