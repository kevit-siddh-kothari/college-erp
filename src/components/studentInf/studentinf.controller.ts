import { Request, Response } from 'express';
import { Student } from '../student/student.module';
import { User, IUser } from '../user/user.module';

interface AuthenticatedRequest extends Request {
    user?: IUser;
    token?: string;
}

class StudentInfoController {
    public async studentInf(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            console.log('hey');
            const { username } = req.params;
            console.log(username);
            if (req.user?.username === username) {
                const student = await Student.find({ username }).populate('department').populate('batch');
                return res.send(student);
            } else {
                return res.status(403).send(`you are not authorized student !`);
            }
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }
}
export const student = new  StudentInfoController();