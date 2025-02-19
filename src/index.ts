import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
    const page = `<h1>URL Shortener
    <p>URL
    <form action="/submit" method="get">
    <input type="text" id="url" name="url">
    <input type="submit" value="Submit" name="button">
    </form>
    `
    res.send(page)
})

app.get('/submit', async (req, res) => {
    const { url } = req.query
    const page = `<h1>URL Shortener</h1>
    You submitted ${url}
    `
    res.send(page)
})

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
