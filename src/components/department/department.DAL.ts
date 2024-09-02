import { Department, IDepartment } from './department.module';
import { Student } from '../student/student.module';
import { Attendance } from '../attendance/attendance.module';

class DepartmentDAL {
  public async getAllDepartments(): Promise<IDepartment[]> {
    try {
      return await Department.find({});
    } catch (error:any) {
      throw new Error(`Error retrieving departments: ${error.message}`);
    }
  }

  public async addDepartment(departmentname: string): Promise<IDepartment> {
    try {
      const department = new Department({ departmentname });
      return await department.save();
    } catch (error: any) {
      throw new Error(`Error adding department: ${error.message}`);
    }
  }

  public async findDepartmentById(id: string): Promise<IDepartment | null> {
    try {
      return await Department.findById(id);
    } catch (error: any) {
      throw new Error(`Error finding department with ID ${id}: ${error.message}`);
    }
  }

  public async updateDepartment(department: IDepartment, updates: Partial<IDepartment>): Promise<IDepartment> {
    try {
      Object.assign(department, updates);
      return await department.save();
    } catch (error: any) {
      throw new Error(`Error updating department: ${error.message}`);
    }
  }

  public async deleteDepartmentById(id: string): Promise<void> {
    try {
      await Attendance.deleteMany({ department: id });
      await Student.deleteMany({ department: id });
      await Department.deleteOne({ _id: id });
    } catch (error: any) {
      throw new Error(`Error deleting department with ID ${id}: ${error.message}`);
    }
  }

  public async deleteAllDepartments(): Promise<void> {
    try {
      await Attendance.deleteMany({});
      await Department.deleteMany({});
      await Student.deleteMany({});
    } catch (error: any) {
      throw new Error(`Error deleting all departments: ${error.message}`);
    }
  }
}

export const departmentDAL = new DepartmentDAL();
