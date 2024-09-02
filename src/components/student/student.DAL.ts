import { Student, IStudent } from './student.module';
import { Department } from '../department/department.module';
import { Attendance } from '../attendance/attendance.module';
import { Batch, IBatch } from '../batch/batch.module';

class StudentDal {

  public async StudentFindOne(id:any): Promise<any>{
    return await Student.findOne({ _id: id })
  }  

  public async StudentCount(): Promise<number> {
    const num = await Student.find().countDocuments();
    return num;
  }

  public async DepartmentFind(branch: any): Promise<any> {
    return await Department.findOne({ departmentname: branch }, { _id: 1 });
  }

  public async getAnalyticsData(): Promise<any> {
    return await await Student.aggregate([
      // Stage 1: Lookup to populate department details
      {
        $lookup: {
          from: 'departments', // The collection to join with
          localField: 'department', // Field from the input documents
          foreignField: '_id', // Field from the documents of the "departments" collection
          as: 'departmentInfo', // Name of the new array field to add
        },
      },
      // Stage 2: Unwind the departmentInfo array to get department details in each document
      {
        $unwind: {
          path: '$departmentInfo',
          preserveNullAndEmptyArrays: false,
        },
      },
      // Stage 3: Group by year and department to count total students per branch
      {
        $group: {
          _id: {
            year: '$batch',
            branch: '$departmentInfo.departmentname', // Adjust this field based on department structure
          },
          totalStudents: { $sum: 1 },
        },
      },
      // Stage 4: Group by year and aggregate branch counts
      {
        $group: {
          _id: '$_id.year',
          totalStudents: { $sum: '$totalStudents' },
          branches: {
            $push: {
              k: '$_id.branch',
              v: '$totalStudents',
            },
          },
        },
      },
      // Stage 5: Convert branch array to an object
      {
        $project: {
          _id: 0,
          year: '$_id',
          totalStudents: 1,
          branches: {
            $arrayToObject: {
              $map: {
                input: '$branches',
                as: 'branch',
                in: {
                  k: '$$branch.k',
                  v: '$$branch.v',
                },
              },
            },
          },
        },
      },
      // Stage 6: Sort by year (optional)
      {
        $sort: {
          year: 1,
        },
      },
    ]);
  }

  public async FindDepartmentById(branchId: any): Promise<any> {
    return await Department.findOne({ _id: branchId }, { _id: 1 }).lean();
  }

  public async GetTotalStudentsPresent(): Promise<any> {
    return await await Attendance.aggregate([
      // Stage 1: Lookup to populate student details
      {
        $lookup: {
          from: 'students', // The collection to join with
          localField: 'student', // The field from the input documents
          foreignField: '_id', // The field from the student collection
          as: 'studentInfo', // Name of the new array field to add
        },
      },
      // Stage 2: Unwind the studentInfo array to get student details in each document
      {
        $unwind: '$studentInfo',
      },
      // Stage 3: Group by student and calculate total presence
      {
        $group: {
          _id: '$studentInfo', // Group by studentInfo after population
          TotalPresent: {
            $sum: { $cond: { if: { $eq: ['$isPresent', true] }, then: 1, else: 0 } },
          },
        },
      },
    ]);
  }

  public async getTotalStudentByBatchAndDepartment(): Promise<any>{
    return await Student.aggregate([
        {
          $group: {
            _id: {
              batch: "$batch",
              department: "$department"
            },
            count: { $sum: 1 }
          }
        }
      ]
    );
  }

  public async BatchUpdateForDelete(exists: any): Promise<any>{
    await Batch.updateOne(
        { '_id': exists.batch, 'branches.departmentId': exists.department },
        { $inc: { 'branches.$.availableSeats': 1, 'branches.$.occupiedSeats': -1 } },
      );
    await Student.deleteOne({ _id: exists._id });
    await Attendance.deleteMany({ student: exists._id });
    return;
  }

  public async DeleteAllStudent(): Promise<any>{
    return await Student.deleteMany({});
  }

  public async DeleteAllAttendance(): Promise<any>{
    return await Attendance.deleteMany({});
  }

  public async UpdateBatchOnStudentAdd(batchId: any, departmenId: any): Promise<any>{
    return  await Batch.updateOne(
        { '_id': batchId, 'branches.departmentId': departmenId },
        { $inc: { 'branches.$.availableSeats': -1, 'branches.$.occupiedSeats': 1 } },
      );
  }

  public async saveStudent(student:IStudent): Promise<any>{
    return await student.save();
  }
}

export const studentDal = new StudentDal();
