const mongoose = require('mongoose');

// Set strictQuery to false to prepare for future changes
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to database'));

db.once('open', () => {
    console.log("successfully connected to database : mongoDB");
});

module.exports = mongoose;
