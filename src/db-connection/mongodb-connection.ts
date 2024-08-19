import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 *
 * @param {string | undefined} url - The MongoDB connection URL.
 * @returns {Promise<void>} A promise that resolves when the connection is established or logs an error if it fails.
 */
const connectionToDb = async (url: string | undefined): Promise<void> => {
  if (url) {
    await mongoose
      .connect(url)
      .then(() => console.log('MongoDB connected successfully!'))
      .catch(err => console.log(err));
    return;
  }
  console.log('MongoDB failed to connect');
};

export { connectionToDb };
