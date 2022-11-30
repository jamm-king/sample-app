const https = require('https')
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 23023
const TOKEN = process.env.LINE_ACCESS_TOKEN || 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/webhook", (req, res) => {
    res.send("HTTP POST request sent to the webhook URL!")
    // If the user sends a message to your bot, send a reply message
    console.log(req.body)
    console.log('-----------------body-----------------')
    console.log(req.body.events[0].message)
    console.log('-----------------message-----------------')
    console.log(req.body.events[0].deliveryContext)
    console.log('-----------------deliveryContext-----------------')
    if (req.body.events[0].type === "message") {
        // Message data, must be stringified
        const dataString = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
                {
                    "type": "text",
                    "text": "Hello, user"
                },
                {
                    "type": "text",
                    "text": "May I help you?"
                }
            ]
        })

        // Request header
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        }

        // Options to pass into the request
        const webhookOptions = {
            "hostname": "api.line.me",
            "path": "/v2/bot/message/reply",
            "method": "POST",
            "headers": headers,
            "body": dataString
        }

        // Define request
        const request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
                process.stdout.write(d)
            })
        })

        // Handle error
        request.on("error", (err) => {
            console.error(err)
        })

        // Send data
        request.write(dataString)
        request.end()
    }
})

const domain = "2017104014.oss2022chatbot.ml"
const sslport = 23023;
const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
}

https.createServer(option, app).listen(sslport, () => {
    console.log(`[HTTPS] Server is started on port ${sslport}`);
})