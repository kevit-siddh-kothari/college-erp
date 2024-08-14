import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface Student extends Document {
  name: string;
  phno: number;
  department: mongoose.Schema.Types.ObjectId;
  batch: number;
  currentsem: number;
}

// Create a schema corresponding to the document interface.
const studentSchema: Schema<Student> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phno: {
    type: Number,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'departments',
  },
  batch: {
    type: Number,
    required: true,
  },
  currentsem: {
    type: Number,
    required: true,
  },
});

// Create a model.
const Student: Model<Student> = mongoose.model<Student>('students', studentSchema);

// Export the model.
export default Student;
