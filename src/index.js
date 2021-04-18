const express = require('express')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
app.use(express.json())

app.post('/mail', async (request, response) => {
  const { from, to, subject, text, html, senderName } = request.body

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  })

  try {
    let info = await transporter.sendMail({
      from: `${senderName} <${from}>`,
      to,
      subject,
      text,
      html
    })

    console.log('Message sent: %s', info.messageId)

    return response.status(201).send()
  } catch (error) {
    return response.status(400).send({ error: `message: ${error}` })
  }
})

app.listen(1409)
