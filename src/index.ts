import { PrismaClient } from '@prisma/client'
import express from 'express'
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

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

// TODO This needs to check if it is already submitted
// TODO actually shorten the URL
app.get('/submit', async (req, res) => {
    const { url } = req.query
    if (typeof url !== "string") {
        res.send("<p>No URL submitted</p>")
    }
    const fullUrl = <string>url
    const shortUrl = fullUrl
    const result = await prisma.url.create({
        data: {
            fullUrl: fullUrl,
            shortUrl: shortUrl
        },
    })

    const page = `<h1>URL Shortener</h1>
    <p>You submitted ${fullUrl}</p>
    <p>It is now ${shortUrl}</p>
    <p>Result is ${result}.</p>
    `
    res.send(page)
})

app.get(`/get/:url`, async (req, res) => {
    const { url } = req.params
    const shortUrl = <string>url

    const result = await prisma.url.findUnique({
        where: { shortUrl: shortUrl },
    })
    const theUrl = result?.fullUrl
    const page = `<h1>URL Shortener</h1>
    <p>You submitted ${shortUrl}</p>
    <p>The URL is <tt>${theUrl}</tt></p>
    `
    res.send(page)
})

app.get('/s3', async (req, res) => {
    const s3Client = new S3Client({ });

    try {
        const input = {};
        const command = new ListBucketsCommand(input);
        const response = await s3Client.send(command);
        console.log("Success", response.Buckets);
        const page = `<h1>URL Shortener S3 Test</h1>
          ${response.Buckets?.map((b) => ` • ${b.Name}`).join("<p>")}
          `
        res.send(page)
    } catch (err) {
        console.log("Error", err);
        const page = `<h1>URL Shortener S3 Test</h1>
            Error ${err}`
        res.send(page)
    }
})

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
