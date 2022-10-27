const moongose = require('mongoose');

//calling database using async await
const db = process.env.mongoURI || 'mongodb://localhost:27017';

const connectDB = async () => {
    try {
        await moongose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDb Connected..');
    } catch (err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
