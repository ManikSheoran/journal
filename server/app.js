const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const userRoutes = require('./routes/user');


MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => { 
    console.log('Connected to MongoDB');
    const db = client.db('mydatabase');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});