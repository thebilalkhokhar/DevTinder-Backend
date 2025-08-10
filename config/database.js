const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://bilalkhokhar228:devtinder@namastedev.kgfaczz.mongodb.net/DevTinder');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
module.exports = connectDB;
