require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const registerRoute = require('./routes/registerapi');  // Import the register route
const loginRoute = require('./routes/loginapi');
const sendEmail = require('./routes/sendEmail'); // Import the sendEmail route
const profileRoutes = require('./routes/profileapi'); 

const ForgotPWDRoutes = require('./routes/forgot_pwd');
const paypalRoutes = require('./routes/paypal_api'); // Import the Braintree routes

//const paypalRoutes = require('./paypal-payment'); // Import PayPal routes



// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Custom headers middleware
app.use(function(req, res, next) {
    res.header("Content-Type", "application/json");
    res.header("Accept", "application/json");
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST'); // Specify allowed HTTP methods
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Specify allowed headers
    next(); // Pass control to the next middleware
 });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Simple route to test if server is running
app.get('/', (req, res) => {
    res.send('Hello, Render! Your Node.js app is running successfully.');
  });
  
  // Additional route for testing
  app.get('/test', (req, res) => {
    res.json({ message: 'This is a test route. Your app is deployed!' });
  });

// Use the register route
app.use('/api', registerRoute);

// Use the Login route
app.use('/api', loginRoute);

// Use the sendEmail route
app.use('/email', sendEmail);

// Use the Profile route
app.use('/api', profileRoutes);

// Use the Forgot Password route
app.use('/api', ForgotPWDRoutes);

// Use the Braintree routes
app.use('/api', paypalRoutes);


// Start the server
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start the server
app.listen(PORT,() => {
    console.log(`Server running on ${PORT}`);
});