const moongose = require('mongoose');

//calling database using async await
const db = process.env.mongoURI || 'mongodb://localhost:27017';
const Category = require('../models/Category');

const connectDB = async () => {
    try {
        await moongose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        function initialCategories() {
            Category.estimatedDocumentCount((err, count) => {
                if (!err && count === 0) {
                    Category.insertMany(
                      [
                          { title: 'PRODUCTS', icon: 'categories/products.png' },
                          { title: 'SERVICES', icon: 'categories/services.png' },
                          { title: 'HOUSING', icon: 'categories/housing.png' },
                      ]
                    )
                      .then(() => {
                          console.log('Categories are initialized.')
                      })
                      .catch(() => {
                          console.log('Categories cannot be initialized.')
                      })
                }
            })
        }

        initialCategories()

        console.log('MongoDb Connected..');
    } catch (err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
