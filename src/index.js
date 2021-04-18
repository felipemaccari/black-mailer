require('dotenv').config()

const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const upload = require('multer')()

app.post('/mail', upload.single('attachment'), async (request, response) => {
  const { from, to, subject, text, html, senderName } = request.body

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  })

  try {
    await transporter.sendMail({
      from: `${senderName} <${from}>`,
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: request.file.originalname,
          content: request.file.buffer
        }
      ]
    })

    return response.status(201).send()
  } catch (error) {
    return response.status(400).send({ error: `message: ${error}` })
  }
})

app.listen(process.env.PORT)

module.exports = app
