const mongoose = require('mongoose');

// Encode the password
const encodedPassword = encodeURIComponent('carbsstore@100');

const uri = `mongodb+srv://carbsstore:${encodedPassword}@cluster0.9vqas78.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`.toString();


mongoose.connect(`${uri}`, { useNewUrlParser: true})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });
console.log(uri)