"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentController = void 0;
const department_module_1 = require("./department.module");
const student_module_1 = require("../student/student.module");
const attendance_module_1 = require("../attendance/attendance.module");
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
    async getAllDepartment(req, res) {
        try {
            const departments = await department_module_1.Department.find({});
            res.status(200).send(departments);
        }
        catch (error) {
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
    async addDepartment(req, res) {
        try {
            const department = new department_module_1.Department({ departmentname: req.body.departmentname });
            await department.save();
            res.send('Department created successfully');
        }
        catch (error) {
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
    async updateDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const department = await department_module_1.Department.findById(id);
            if (!department) {
                return res.status(404).json({ error: 'No department with ID ${id} exists in the database' });
            }
            const body = req.body;
            for (const key in body) {
                department[key] = body[key];
            }
            await department.save();
            res.send('Department updated successfully');
        }
        catch (error) {
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
    async deleteDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const department = await department_module_1.Department.findById(id);
            if (!department) {
                return res.status(404).json({ error: `department not found with name ${id}` });
            }
            await attendance_module_1.Attendance.deleteMany({ department: id });
            await student_module_1.Student.deleteMany({ department: id });
            await department_module_1.Department.deleteOne({ _id: id });
            res.send(`Department with ID ${id} deleted successfully along with associated students and attendance records.`);
        }
        catch (error) {
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
    async deleteAllDepartment(req, res) {
        try {
            await attendance_module_1.Attendance.deleteMany({});
            await department_module_1.Department.deleteMany({});
            await student_module_1.Student.deleteMany({});
            res.status(200).send('All departments, students, and attendance records deleted successfully');
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}
// Export the controller as an instance
exports.departmentController = new DepartmentController();
