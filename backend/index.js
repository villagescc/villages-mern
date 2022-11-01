require("dotenv").config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors')
//connect database
connectDB();
//Initialise middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(bodyparser.json());

//Define routes
app.use('/api/base', require('./routes/api/base'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posting', require('./routes/api/posting'));

app.use((error, req, res, next) => {
  res.status(500).send({ error: error })
})

app.use((req, res, next) => {
  res.status(404).send({ error: 'Not Found' })
})

//Serve Static Assets
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
