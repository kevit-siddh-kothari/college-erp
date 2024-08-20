import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface IDepartment extends Document {
  [key: string]: any;
  departmentname?: string;
}

// Create a schema corresponding to the document interface.
const departmentSchema: Schema<IDepartment> = new mongoose.Schema({
  departmentname: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create a model.
const Department: Model<IDepartment> = mongoose.model<IDepartment>('departments', departmentSchema);

// Export the model.
export { Department, IDepartment };
