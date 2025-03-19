const express = require('express');
const app = express();
const PORT = 3000;
const AWS = require('aws-sdk');
require('dotenv').config();

// register middleware and config view
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

// config aws dynamodb
const config = new AWS.Config({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "class01";

app.get('/', (req, res) => {
    const params = {
        TableName: table
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Scan succeeded.");
            res.render('index', { courses: data.Items });
        }
    });
});

app.post('/add', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            ...req.body,
            id: Date.now().toString
        }
    };

    docClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.redirect('/');
        }
    });
});

app.post('/delete/:id', (req, res) => {
    const params = {
        TableName: table,
        Key: {
            id: req.params.id
        }
    };

    docClient.delete(params, (err, data) => {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Delete item:", JSON.stringify(data, null, 2));
            res.redirect('/');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 