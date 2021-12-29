const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const cafesRoutes = require('./routes/cafes-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//   next();
// });
app.use(cors());

app.use('/api/cafes', cafesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  return next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred' });
});

app.options('*', (req, res) => {
  res.json({ status: 'OK' });
});

mongoose
  .connect(
    'mongodb+srv://dusan:bvaeXr0FSIQ7sN69@cluster0.zslhg.mongodb.net/cafes?retryWrites=true&w=majority'
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));