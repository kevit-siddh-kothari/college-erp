import { Request, Response } from 'express';
import { Department, IDepartment } from './department.module';
import { Student } from '../student/student.module';
import { Attendance } from '../attendance/attendance.module';
import { IUser } from '../user/user.module';
import { validationResult } from 'express-validator';

/**
 * Interface extending the Express Request to include user and token.
 */
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * Controller class for handling department-related operations.
 */
class DepartmentController {
  /**
   * Retrieves all departments from the database.
   * Only accessible by an admin user.
   *
   * @param {AuthenticatedRequest & Request} req - The request object, which includes the user information.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} A promise that resolves with no value.
   * @throws {Error} Throws an error if the user is not authorized or if there's an issue retrieving data.
   */
  public async getAllDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const departments: IDepartment[] = await Department.find({});
      res.status(200).send(departments);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  /**
   * Adds a new department to the database.
   * Only accessible by an admin user.
   *
   * @param {AuthenticatedRequest & Request} req - The request object, which includes the department details.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} A promise that resolves with no value.
   * @throws {Error} Throws an error if there are validation issues or if there's an issue saving the department.
   */
  public async addDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const department = new Department({ departmentname: req.body.departmentname });
      await department.save();
      res.send('Department created successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  /**
   * Updates an existing department by ID.
   * Only accessible by an admin user.
   *
   * @param {AuthenticatedRequest & Request} req - The request object, which includes the department ID and updated details.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} A promise that resolves with no value.
   * @throws {Error} Throws an error if the department is not found or if there's an issue updating the department.
   */
  public async updateDepartmentById(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const department: IDepartment | null = await Department.findById(id);
      if (!department) {
        return res.status(404).json({error:'No department with ID ${id} exists in the database'});
      }
      const body: Partial<IDepartment> = req.body;
      for (const key in body) {
        department[key] = body[key];
      }
      await department.save();
      res.send('Department updated successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  /**
   * Deletes an existing department by ID.
   * Also deletes associated students and attendance records.
   * Only accessible by an admin user.
   *
   * @param {AuthenticatedRequest & Request} req - The request object, which includes the department ID.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} A promise that resolves with no value.
   * @throws {Error} Throws an error if the department is not found or if there's an issue deleting related records.
   */
  public async deleteDepartmentById(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const department: IDepartment | null = await Department.findById(id);
      if (!department) {
        return res.status(404).json({error:`department not found with name ${id}`});
      }
      await Attendance.deleteMany({ department: id });
      await Student.deleteMany({ department: id });
      await Department.deleteOne({ _id: id });
      res.send(`Department with ID ${id} deleted successfully along with associated students and attendance records.`);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  /**
   * Deletes all departments, students, and attendance records from the database.
   * Only accessible by an admin user.
   *
   * @param {AuthenticatedRequest & Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} A promise that resolves with no value.
   * @throws {Error} Throws an error if there's an issue deleting the records.
   */
  public async deleteAllDepartment(req: AuthenticatedRequest & Request, res: Response): Promise<any> {
    try {
      await Attendance.deleteMany({});
      await Department.deleteMany({});
      await Student.deleteMany({});
      res.status(200).send('All departments, students, and attendance records deleted successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

// Export the controller as an instance
export const departmentController = new DepartmentController();
