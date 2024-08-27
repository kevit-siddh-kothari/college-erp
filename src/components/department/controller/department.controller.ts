import { Department, IDepartment } from '../module/department';
import { Student } from '../../student/module/student';
import { Request, Response } from 'express';
import { Attendance } from '../../attendance/module/attendance';
import { IUser } from '../../user/module/user';
import { validationResult } from 'express-validator';

/**
 * Interface extending the Express Request to include user and token.
 */
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * Retrieves all departments from the database.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const getAllDepartment = async (req: AuthenticatedRequest & Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      throw new Error('You are authenticated but not authorized for department controls!');
    }
    const departments: IDepartment[] = await Department.find({});
    res.status(200).send(departments);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Adds a new department to the database.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const addDepartment = async (req: AuthenticatedRequest & Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Throw an error with the validation errors
      throw new Error(JSON.stringify({ errors: errors.array() }));
    }
    const department = new Department({ departmentname: req.body.departmentname });
    await department.save();
    res.send('Department created successfully');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Updates an existing department by ID.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const updateDepartmentById = async (req: AuthenticatedRequest & Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department: IDepartment | null = await Department.findById(id);
    if (!department) {
      throw new Error(`No department with ID ${id} exists in the database`);
    }
    const body: Partial<IDepartment> = req.body;
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        department[key] = body[key];
      }
    }
    await department.save();
    res.send('Department updated successfully');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Deletes an existing department by ID.
 * Also deletes associated students and attendance records.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const deleteDepartmentById = async (req: AuthenticatedRequest & Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department: IDepartment | null = await Department.findById(id);
    if (!department) {
      throw new Error(`No department with ID ${id} exists in the database`);
    }
    await Attendance.deleteMany({ department: id });
    await Student.deleteMany({ department: id });
    await Department.deleteOne({ _id: id });
    res.send(`Department with ID ${id} deleted successfully along with associated students and attendance records.`);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Deletes all departments, students, and attendance records from the database.
 * Only accessible by an admin user.
 *
 * @param {AuthenticatedRequest & Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const deleteAllDepartment = async (req: AuthenticatedRequest & Request, res: Response): Promise<void> => {
  try {
    await Attendance.deleteMany({});
    await Department.deleteMany({});
    await Student.deleteMany({});
    res.status(200).send('All departments, students, and attendance records deleted successfully');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export { getAllDepartment, addDepartment, updateDepartmentById, deleteDepartmentById, deleteAllDepartment };
