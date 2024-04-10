const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Configuration for Google Sheets API
const credentials = require('./path/to/your/credentials.json');
const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
const spreadsheetId = 'https://docs.google.com/spreadsheets/d/1-EGt-hxlXQWZRvdvxQxN_UT8QDtjeULgetNos7uq5FQ/edit?usp=sharing';
const range = 'Sheet1';

// Configuration for email service (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL_ADDRESS',
    pass: 'YOUR_full_name'
  }
});

// Initialize Google Sheets API
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);
const sheets = google.sheets({ version: 'v4', auth });

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Route to handle login and store user information
app.post('/login', async (req, res) => {
  const { fullName, email } = req.body;
  try {
    // Add user information to Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[fullName, email]]
      }
    });
    console.log('User information added to Google Sheet:', response.data);
    
    // Send email notification
    await transporter.sendMail({
      from: 'YOUR_EMAIL_ADDRESS',
      to: 'mourad2003qlf@gmail.com',
      subject: 'New User Logged In',
      text: `A new user logged in.\nName: ${fullName}\nEmail: ${email}`
    });
    
    res.status(200).send('User information added successfully');
  } catch (error) {
    console.error('Error adding user information:', error);
    res.status(500).send('Error adding user information');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
