import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface Attendance extends Document {
  student: mongoose.Schema.Types.ObjectId;
  date: Date;
  attendance: 'present' | 'absent';
}

// Create a schema corresponding to the document interface.
const attendanceSchema: Schema<Attendance> = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'students',
  },
  date: {
    type: Date,
    required: true,
  },
  attendance: {
    type: String,
    enum: ['present', 'absent'],
  },
});

// Create a model.
const Attendance: Model<Attendance> = mongoose.model<Attendance>('attendance', attendanceSchema);

// Export the model.
export default Attendance;
