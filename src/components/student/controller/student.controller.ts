import { Request, Response } from 'express';
import { Student, IStudent } from '../module/student';
import { Department } from '../../department/module/department';
import { Attendance } from '../../attendance/module/attendance';

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
    await student.save();
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

// Export the functions
export { addStudent, updateStudentById, deleteStudentById, deleteAllStudents, getAllStudent };
