require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const FormData = require('./models/FormData');
const { client } = require('./db');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST']
}));
app.use(bodyParser.json({ limit: '10mb' }));

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to send email
const sendEmailNotification = async (formData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `New ${formData.formType} Form Submission!`,
    text: `A new form has been submitted with the following data:\n\n${JSON.stringify(formData, null, 2)}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Generic form handler
const handleFormSubmission = async (formType, req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No data provided' });
    }

    data.formType = formType;

    // Insert form data into MongoDB using model function
    const result = await FormData.insertFormData(data);

    // Send email notification asynchronously
    sendEmailNotification(data).catch(err =>
      console.error(`Email notification failed for ${formType}:`, err)
    );

    res.status(201).json({ message: 'Form data saved successfully', insertId: result.insertedId });
  } catch (error) {
    console.error(`Error saving ${formType} form data:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Route handlers
app.post('/api/for-funder', (req, res) => handleFormSubmission('for-funder', req, res));
app.post('/api/index', (req, res) => handleFormSubmission('index', req, res));
app.post('/api/partner-with-us', (req, res) => handleFormSubmission('partner-with-us', req, res));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  await client.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// New route to fetch data from external site
app.get('/api/fetch-external-data', async (req, res) => {
  try {
    const response = await axios.get('https://mediumvioletred-falcon-991761.hostingersite.com/');
    res.json({ data: response.data });
  } catch (error) {
    console.error('Error fetching external data:', error.message);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});
