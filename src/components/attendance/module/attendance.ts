import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface IAttendance extends Document {
  [key: string]: any;
  student: mongoose.Schema.Types.ObjectId;
  department: mongoose.Schema.Types.ObjectId;
  date: Date;
  present: number;
  absent: number;
}

// Create a schema corresponding to the document interface.
const attendanceSchema: Schema<IAttendance> = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'students',
      unique: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'departmnets',
    },
    present: {
      type: Number,
      default: 0,
    },
    absent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Create a model.
const Attendance: Model<IAttendance> = mongoose.model<IAttendance>('attendance', attendanceSchema);

// Export the model.
export { Attendance, IAttendance };
