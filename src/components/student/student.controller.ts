import { Request, Response } from 'express';
import { Student, IStudent } from './student.module';
import { Department } from '../department/department.module';
import { Attendance } from '../attendance/attendance.module';
import { Batch, IBatch } from '../batch/batch.module';
import {logger} from '../../utils/winstone.logger';
import {studentDal} from './student.DAL';

class StudentController {
  /**
   * Handles getting all student.
   *
   * @param {Request} req - Express request object containing the student data in the body.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Returns nothing. Sends a response to the client.
   */
  public async getAllStudent(req: Request, res: Response): Promise<any> {
    try {
      // Fetch all students from the database
      const students = await Student.find({});

      res.status(200).json(students);
    } catch (error: any) {
      logger.error(`Error fetching students: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Handles adding a new student.
   *
   * @param {Request} req - Express request object containing the student data in the body.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Returns nothing. Sends a response to the client.
   */
  async addStudent(req: Request, res: Response): Promise<any> {
    try {
      const departmenId = await Department.findOne({ _id: req.body.departmentid }, { _id: 1 });
      if (!departmenId) {
        logger.error(`No department with name ${req.body.departmentname} exists`);
        return res.status(404).json({error:`No department with name ${req.body.departmentname} exists`});
      }
      //for checking the avaibaility of student entry in database
      const batchData: IBatch = await Batch.find(
        { _id: req.body.batch, 'branches.departmentId': departmenId._id },
        { branches: 1, _id: 0 },
      ).lean();
      if (batchData.length === 0) {
        logger.error(`no batch exist in the year ${req.body.batch}`);
        return res.status(404).json({error:`no batch exist in the year ${req.body.batch} please also check that department is current available`});
      }
      batchData.forEach((item: any) => {
        item.branches.forEach((branch: any) => {
          if (branch.departmentId._id.equals(departmenId._id)) {
            if (branch.availableSeats <= 0) {
              throw new Error(`no more entries`);
            }
          }
        });
      });
      const student: IStudent = new Student({
        username: req.body.username,
        name: req.body.name,
        phno: req.body.phno,
        department: departmenId,
        batch: req.body.batch,
        currentsem: req.body.currentsem,
      });
      await studentDal.saveStudent(student);
      await studentDal.UpdateBatchOnStudentAdd(req.body.batch, departmenId._id);
      res.status(201).json({message:`student created sucessfully with default present attendance`});
    } catch (error: any) {
      logger.error(error.any);
      res.status(500).json({error:error.message});
    }
  }

  /**
   * Handles updating an existing student.
   *
   * @param {Request} req - Express request object containing the student data in the body and the student ID in the URL params.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Returns nothing. Sends a response to the client.
   */
  async updateStudentById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const student: IStudent | null = await Student.findOne({ _id: id });
      if (!student) {
        logger.error(`no student esixts bu this id ${id}`);
        return res.status(404).json({error:`no student esixts for this id ${id}`});
      }
      const body: IStudent = req.body;
      for (let a in body) {
        student[a] = body[a];
      }
      await studentDal.saveStudent(student);
      res.status(200).json({message:'student Updated sucessfully'});
    } catch (error: any) {
      logger.error(error.message);
      res.status(500).send(error.message);
    }
  }

  /**
   * Handles deleting a specific student.
   *
   * @param {Request} req - Express request object containing the student ID in the URL params.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Returns nothing. Sends a response to the client.
   */
  async deleteStudentById(req: Request, res: Response): Promise<any> {
    // Your implementation here
    try {
      const { id } = req.params;
      const exists: IStudent | null = await studentDal.StudentFindOne(id);
      if (!exists) {
        logger.error(`no student esixts with this id ${id}`);
        return res.status(404).json({error:`no student esixts with this id ${id}`});
      }
      await studentDal.BatchUpdateForDelete(exists)
      res.json({error: `student deleted sucessfully!`});
    } catch (error: any) {
      logger.error(error.message);
      res.status(500).json({error: error.message});
    }
  }

  /**
   * Handles deleting all students.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Returns nothing. Sends a response to the client.
   */
  async deleteAllStudents(req: Request, res: Response): Promise<any> {
    try {
      const TotalStudentCounnt: any = studentDal.getTotalStudentByBatchAndDepartment();
      for(let student = 0; student<TotalStudentCounnt.length; student++){
        await studentDal.BatchUpdateForDelete(TotalStudentCounnt[student]);
      }
     await studentDal.DeleteAllStudent();
     await studentDal.DeleteAllAttendance();
      res.status(200).json({message:`All students data is cleared`});
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  /**
   * Get the list of absent students for a specific date, optionally filtering by batch, branch, and current semester.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<any>} - A promise that resolves to sending a response to the client
   *
   * @throws {Error} - Throws an error if any issue occurs during the database operations
   */
  async getAbsentStudents(req: Request, res: Response): Promise<any> {
    try {
      const { date } = req.params;
      const { batch, branch, currentsem } = req.query;
      if (!date) {
        logger.error(`Date parameter is required.`);
        return res.status(400).json({ error: 'Date parameter is required.' });
      }

      const startDay = new Date(date);
      startDay.setUTCHours(0, 0, 0, 0);
      const endDay = new Date(date);
      endDay.setUTCHours(23, 59, 59, 999);

      // Fetch attendance records for the specific date
      const attendanceRecords = await Attendance.find(
        { createdAt: { $gte: startDay, $lte: endDay } },
        { student: 1, _id: 0, isPresent: 1 },
      )
        .populate('student', 'batch currentsem department')
        .lean();

      console.log(attendanceRecords);

      if (!attendanceRecords.length) {
        logger.error(`No attendance records found for the date '${date} please add attendance`);
        return res.status(404).json({ error: `No attendance records found for the date '${date}'.` });
      }

      // Filter attendance records based on optional query parameters
      const filteredStudents = attendanceRecords.filter((record: any) => {
        const student = record.student;
        const matchBatch = batch ? String(student.batch) === String(batch) : true;
        const matchBranch = branch ? String(student.department) === String(branch) : true;
        const matchCurrentsem = currentsem ? Number(student.currentsem) === Number(currentsem) : true;

        return matchBatch && matchBranch && matchCurrentsem;
      });

      if (!filteredStudents.length) {
        logger.error('No matching students found based on the provided criteria.')
        return res.status(404).json({ error: 'No matching students found based on the provided criteria.' });
      }

      // Send the filtered list of absent students as response
      res.status(200).json(filteredStudents);
    } catch (error: any) {
      logger.error('Error fetching absent students:', error);
      res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
  }

  async presentLessThan75(req: Request, res: Response): Promise<any> {
   try{
    const { branch, batch, currentsem } = req.query;
    const attendance: any = await studentDal.GetTotalStudentsPresent();
    let branchId: unknown;
    if (branch) {
      const department: any = await studentDal.FindDepartmentById(branch);
      if (!department) {
        logger.error(`Branch '${branch}' not found.`);
        res.status(404).json({ error: `Branch '${branch}' not found.` });
        return;
      }
      branchId = department._id;
      console.log(branchId);
    }

    const data: {}[] = [];
    const filteredStudents = await attendance.filter((record: any) => {
      if (record.TotalPresent < 23) {
        const student = record._id;

        const matchBatch = batch ? String(student.batch) === String(batch) : true;
        const matchBranch = branch ? String(student.department) === String(branch) : true;
        const matchCurrentsem = currentsem ? student.currentsem === Number(currentsem) : true;
        return matchBatch && matchBranch && matchCurrentsem;
      }
    });
    res.status(200).json(filteredStudents);
   }catch(error: any){
    logger.error(`error.message`);
    res.status(500).send(error.message);
   }
  }

  public async getAnalyticsData(req: Request, res: Response) {
    try{
    const analyticsData = await studentDal.getAnalyticsData();
    res.status(200).json(analyticsData);
    }catch(error: any){
      logger.error(error.message);
      res.status(500).json({error: error.message});
    }
  }

  public async getVacantSeats(req: Request, res: Response): Promise<any> {
    try {
      const { batch, branch } = req.query;
      const departmentId: any = await studentDal.DepartmentFind(branch);

      let arr: {}[] = [];
      let query: any = {};
      if (batch) {
        query.year = Number(batch);
      }
      if (branch && departmentId) {
        query['branches'] = { $elemMatch: { departmentId: departmentId._id } };
      }
      const batchData = await Batch.find(query).lean();
      if (!batchData.length) {
        throw new Error(`no output for specified year ${batch}`);
      }
      for (let batch = 0; batch < batchData.length; batch++) {
        let batchobj: any = {};
        batchobj.year = batchData[batch].year;
        batchobj.totalStudents = await studentDal.StudentCount();
        let intake: number = 0;
        let avaibaility: number = 0;
        for (let a of batchData[batch].branches) {
          intake += a.totalStudentsIntake;
          avaibaility += a.availableSeats;
        }
        batchobj.totalStudentsIntake = intake;
        batchobj.availableIntake = avaibaility;
        batchobj.branches = batchData[batch].branches;
        arr.push(batchobj);
      }

      res.status(200).json(arr);
    } catch (error: any) {
      res.status(500).json({error:error.message});
    }
  }
}

// Export the functions
export const studentController = new StudentController();
