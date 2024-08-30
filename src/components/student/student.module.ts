import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface IStudent extends Document {
  [key: string]: any; // fro student controller updating api endpoint
  username?: string,
  name?: string;
  phno?: number;
  department?: mongoose.Schema.Types.ObjectId | undefined;
  batch?: mongoose.Schema.Types.ObjectId | undefined;
  currentsem?: number;
}

// Create a schema corresponding to the document interface.
const studentSchema: Schema<IStudent> = new mongoose.Schema({
  username:{
    type: String,
    required: true,
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'batches',
    required: true,
  },
  currentsem: {
    type: Number,
    required: true,
  },
});

// Create a model.
const Student: Model<IStudent> = mongoose.model<IStudent>('students', studentSchema);

// Export the model.
export { Student, IStudent };
