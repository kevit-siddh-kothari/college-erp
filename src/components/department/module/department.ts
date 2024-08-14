import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
 **/
interface Department extends Document {
  departmnetname: string;
}

// Create a schema corresponding to the document interface.
const departmentSchema: Schema<Department> = new mongoose.Schema({
  departmnetname: {
    type: String,
    required: true,
  },
});

// Create a model.
const Department: Model<Department> = mongoose.model<Department>('departments', departmentSchema);

// Export the model.
export default Department;
