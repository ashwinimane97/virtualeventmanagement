const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {

    while (retries) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                connectTimeoutMS: 10000, // Timeout after 10 seconds
            });
            console.log('MongoDB Connected Successfully');
            return;
        } catch (error) {
            console.error('MongoDB Connection Failed:', error);
            retries-=1;

            console.log(`Retrying in ${delay / 1000} seconds... (${retries} retries left)`);

            if(retries == 0) {
                console.error('All retries exhausted. existing process.')
                process.exit(1); // Exit process with failure
            }

            await new Promise((resolve) => setTimeout(resolve, delay));

        }
    }

};

module.exports = connectDB;
