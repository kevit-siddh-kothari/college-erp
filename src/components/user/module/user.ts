import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Define an interface representing a document in MongoDB.
 * extends Document here inherit all properties and methods of mongodb like save(), _id, ....
**/
interface User extends Document {
    username: string;
    password: string;
    role: 'staffmember' | 'admin';
}

// Create a schema corresponding to the document interface.
const usersSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['staffmember', 'admin'],
        default: 'staffmember',
    },
});

// Create a model.
const User: Model<User> = mongoose.model<User>('User', usersSchema);

// Export the model.
export default User;
