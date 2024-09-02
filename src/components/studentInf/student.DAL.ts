import { Student } from '../student/student.module';

class StudentDAL {
  public async findStudentByUsername(username: string) {
    try {
      return await Student.find({ username }).populate('department').populate('batch');
    } catch (error: any) {
      throw new Error(`Error finding student: ${error.message}`);
    }
  }
}

export const studentDAL = new StudentDAL();
