import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface representing a branch in a batch.
 * @interface
 */
interface IBranch {
  name: string;
  totalStudentsIntake: number;
  availableSeats: number;
  occupiedSeats: number;
}

/**
 * Interface representing a batch document in MongoDB.
 * @interface
 */
interface IBatch extends Document {
  [key: string]: any;
  _id?: mongoose.Schema.Types.ObjectId;
  year: number;
  branches: IBranch[];
}

/**
 * Mongoose schema for the branch subdocument.
 */
const branchSchema: Schema<IBranch> = new Schema({
  name: {
    type: String,
    required: true,
  },
  totalStudentsIntake: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  occupiedSeats: {
    type: Number,
    required: true,
  },
});

/**
 * Mongoose schema for the batch document.
 */
const batchSchema: Schema<IBatch> = new Schema({
  year: {
    type: Number,
    required: true,
  },
  branches: [branchSchema],
});

/**
 * Mongoose model for the batch collection.
 * @type {Model<IBatch>}
 */
const Batch: Model<IBatch> = mongoose.model<IBatch>('batches', batchSchema);

export { Batch, IBatch };
