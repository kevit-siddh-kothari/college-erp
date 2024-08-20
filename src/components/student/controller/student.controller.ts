import { Request, Response } from 'express';
import { Student, IStudent } from '../module/student';
import { Department } from '../../department/module/department';
import { Attendance } from '../../attendance/module/attendance';
import { Batch, IBatch } from '../../batch/module/batch';
import { error } from 'console';

/**
 * Handles getting all student.
 *
 * @param {Request} req - Express request object containing the student data in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const getAllStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all students from the database
    const students = await Student.find({});

    res.status(200).json(students);
  } catch (error: any) {
    console.error(`Error fetching students: ${error.message}`);
    res.status(404).json({ error: 'Internal Server Error' });
  }
};

/**
 * Handles adding a new student.
 *
 * @param {Request} req - Express request object containing the student data in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const addStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phno, departmentname, batch, currentsem } = req.body;
    const departmenId = await Department.findOne({ departmentname }, { _id: 1 });
    if (!departmenId) {
      throw new Error(`No department with name ${departmentname} exists`);
    }
    const student: IStudent = new Student({
      name,
      phno,
      department: departmenId,
      batch,
      currentsem,
    });

    //for checking the avaibaility of student entry in database
    const batchData: any = await Batch.find({ year: batch }, { branches: 1, _id: 0 }).lean();
    batchData.forEach((item: any) => {
      item.branches.forEach((branch: any) => {
        if (branch.name === departmentname) {
          if (branch.availableSeats <= 0) {
            throw new Error(`no more entries`);
          }
        }
      });
    });

    await student.save();
    await Batch.updateOne(
      { 'year': batch, 'branches.name': departmentname },
      { $inc: { 'branches.$.availableSeats': -1, 'branches.$.occupiedSeats': 1 } },
    );
    const data = new Attendance({ student: student._id, department: student.department });
    await data.save();
    res.status(201).send(`student created sucessfully with default present attendance`);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Handles updating an existing student.
 *
 * @param {Request} req - Express request object containing the student data in the body and the student ID in the URL params.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const updateStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student: IStudent | null = await Student.findOne({ _id: id });
    if (!student) {
      throw new Error(`no student esixts bu this id ${id}`);
    }
    const body: IStudent = req.body;
    for (let a in body) {
      student[a] = body[a];
    }
    await student.save();
    res.send('task Updated sucessfully');
  } catch (error) {
    res.status(400).send(error);
  }
};

/**
 * Handles deleting a specific student.
 *
 * @param {Request} req - Express request object containing the student ID in the URL params.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const deleteStudentById = async (req: Request, res: Response): Promise<void> => {
  // Your implementation here
  try {
    const { id } = req.params;
    const student: IStudent | null = await Student.findOne({ _id: id });
    if (!student) {
      throw new Error(`no student esixts with this id ${id}`);
    }
    await Batch.updateOne(
      { 'year': student.batch, 'branches.name': student.department },
      { $inc: { 'branches.$.availableSeats': 1, 'branches.$.occupiedSeats': -1 } },
    );
    await Student.deleteOne({ _id: student._id });
    await Attendance.deleteMany({ student: student._id });
    res.send(`student deleted sucessfully!`);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Handles deleting all students.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Returns nothing. Sends a response to the client.
 */
const deleteAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    await Student.deleteMany({});
    await Attendance.deleteMany({});
    res.send(`All students data is cleared`);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * Get the list of absent students for a specific date, optionally filtering by batch, branch, and current semester.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - A promise that resolves to sending a response to the client
 *
 * @throws {Error} - Throws an error if any issue occurs during the database operations
 */
const getAbsentStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const { batch, branch, currentsem } = req.query;

    // Ensure that the date parameter is provided
    if (!date) {
      res.status(400).json({ error: 'Date parameter is required.' });
      return;
    }

    // Initialize the branchId as unknown
    let branchId: unknown;

    // If branch is provided, find the corresponding department ID
    if (branch) {
      const department = await Department.findOne({ departmentname: branch }, { _id: 1 }).lean();
      if (!department) {
        res.status(404).json({ error: `Branch '${branch}' not found.` });
        return;
      }
      branchId = department._id;
    }

    // Fetch attendance records for the specific date
    const attendanceRecords = await Attendance.find({ createdAt: date }, { student: 1, _id: 0, present: 1, absent: 1 })
      .populate('student', 'batch currentsem department')
      .lean();

    if (!attendanceRecords.length) {
      res.status(404).json({ error: `No attendance records found for the date '${date}'.` });
      return;
    }

    // Filter attendance records based on optional query parameters
    const filteredStudents = attendanceRecords.filter((record: any) => {
      const student = record.student;

      const matchBatch = batch ? student.batch === Number(batch) : true;
      const matchBranch = branch ? String(student.department) === String(branchId) : true;
      const matchCurrentsem = currentsem ? student.currentsem === Number(currentsem) : true;
      return matchBatch && matchBranch && matchCurrentsem;
    });

    if (!filteredStudents.length) {
      res.status(404).json({ error: 'No matching students found based on the provided criteria.' });
      return;
    }
    for (let a of filteredStudents) {
      if (((a.present + a.absent) / 30) * 100 < 75) {
        a.message = 'Student current month atendace is less than 75';
      }
    }
    // Send the filtered list of absent students as response
    res.status(200).json(filteredStudents);
  } catch (error: any) {
    // Log the error and send a generic error message
    console.error('Error fetching absent students:', error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};

const getAnalyticsData = async (req: Request, res: Response) => {
  const analyticsData = await Student.aggregate([
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
  console.log(analyticsData);
  res.send(analyticsData);
};

const getVacantSeats = async (req: Request, res: Response): Promise<void> => {};

// Export the functions
export {
  addStudent,
  updateStudentById,
  deleteStudentById,
  deleteAllStudents,
  getAllStudent,
  getAbsentStudents,
  getAnalyticsData,
  getVacantSeats,
};
