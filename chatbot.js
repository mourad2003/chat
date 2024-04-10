const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const client = twilio('AC90cd3a7fca7410986d52eb7017da2f84', '37c6a77ad233d9060f3f44165bd821fa');

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { name, email } = req.body;

  // Send WhatsApp message
  client.messages
    .create({
      body: `New login:\nName: ${name}\nEmail: ${email}`,
      from: '+213797756982',
      to: '+213797756982'
    })
    .then(message => console.log(`WhatsApp message sent: ${message.sid}`))
    .catch(err => console.error('Error sending WhatsApp message:', err));

  res.status(200).send('Message sent');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
