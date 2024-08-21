import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface IAttendance extends Document {
  [key: string]: any;
  student: mongoose.Schema.Types.ObjectId;
  isPresent: Boolean;
}

// Create a schema corresponding to the document interface.
const attendanceSchema: Schema<IAttendance> = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'students',
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Create a model.
const Attendance: Model<IAttendance> = mongoose.model<IAttendance>('attendance', attendanceSchema);

// Export the model.
export { Attendance, IAttendance };
