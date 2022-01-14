
const { XummSdk } = require("xumm-sdk")
const Sdk = new XummSdk("9634c531-c98b-4c8e-aa5e-d26fd66ab844", "695e2444-a979-4f6e-bc2a-3e79208ff343")
//const Sdk = new XummSdk("508829b8-1bb1-4a7d-8ccb-e74003dd2ea5", "3f0eba1e-5206-4f5c-b745-782eb5fc5b4f")
const path = require('path')
const cookieParser = require('cookie-parser')
const { XrplClient } = require('xrpl-client')
const config = require('dotenv').config({ path: ".env-our" }).parsed
const fs = require('fs')
let app = require('express').Router()
const xrpl = new XrplClient(config?.node || 'wss://xrplcluster.com')
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '/public/start.html'))
})
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/register.html'))
})


// app.get("/registered", cookieParser(), (req, res) => {
//     let data = require("./data.json")
//     data.users.push(req.cookies.user)
//     fs.writeFileSync("./data.json", JSON.stringify(data, null, 2))
//     res.redirect("/tokens")
// })

app.get("/tokens", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/tokens.html'))
})


app.get("/uuid", cookieParser(), async (req, res) => {
    let payload = await Sdk.payload.create({
        TransactionType: "TrustSet",
        Account: req.cookies.user,
        Flags: 131072,
        LimitAmount: {
            "currency": config.token,
            "issuer": config.issuer,
            "value": "1000000"
        }
    })
    res.json(payload)
})

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/success.html'))
})
app.get("/wait", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/wait.html'))
})
app.get("/init/:id", async (req, res) => {
    let user = (await Sdk.xApp.get(req.params.id))
    //let data = require("./data.json")
    //let choice = data.users.includes(user.account)
    let choice = false
    let data = await xrpl.send({ command: "account_lines", account: user.account })
    for (let el of data.lines) {
        if (el.account === config.issuer) {
            choice = true
            break
        }
    }
    res.cookie("user", user.account, { expires: new Date(Date.now() + 86400000) })
    res.json({ registered: choice, account: user.account })
})

module.exports.router = app