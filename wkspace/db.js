import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'MONGO_URI=mongodb+srv://photography:%40170782ViveK@cluster0.px7wn.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

export default connectDB;
