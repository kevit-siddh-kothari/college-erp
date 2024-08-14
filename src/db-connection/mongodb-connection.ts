import mongoose from 'mongoose';

const connectionToDb: (url: string | undefined) => Promise<void> = async url => {
  if (url) {
    await mongoose
      .connect(url)
      .then(() => console.log(`mongodb connected sucessfully !`))
      .catch(err => console.log(err));
    return;
  }
  console.log(`mongodb failed to connect`);
};

export { connectionToDb };
