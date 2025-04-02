const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');

const {
    docClient,
    s3,
    tableName
} = require('./helper/aws.helper');

const {
    uploadFile
} = require('./helper/file.helper');

// config 
app.use(express.urlencoded({extended: false}));
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    docClient.scan({
        TableName: tableName
    }, (err, data) => {
        if(err) {
            console.log("error scan");
            return res.redirect('/');
        } else {
            console.log("scan succeeded ", data.Items);
            return res.render('index', {
                items : data.Items
            });
        }
    });
});

const storage = multer.memoryStorage();
const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}).single('hinhAnh');

app.post('/save', uploadMiddleware,async (req, res) => {
    const file = req.file;
    if(!file) {
        console.log("Not found");
        return res.redirect('/');
    }

    const { maXe, tenDongXe, loaiXe , gia } = req.body;
    const regexTen = /^[a-zA-Z0-9\s]+$/;

    if (!tenDongXe || !regexTen.test(tenDongXe)) {
        return res.status(400).json({ error: "Tên dòng xe không hợp lệ!" });
    }

    const image = await uploadFile(file); 

    docClient.put({
        TableName: tableName,
        Item: {
            hinhAnh: image,
            ...req.body,
        }
    }, (err, data) => {
        if(err) {
            console.log("Save error");
            return res.redirect('/');
        } else {
            console.log("Save succeeded");
            return res.redirect('/');
        }
    });
});

app.post('/delete/:maXe', (req, res) => {
    docClient.query({
        TableName: tableName,
        KeyConditionExpression: 'maXe = :maXe',
        ExpressionAttributeValues: {
            ":maXe": req.params.maXe
        }
    }, (err, data) => {
        if(err) {
            console.log("Query error");
            return res.redirect('/');
        } else{ 
            docClient.delete({
                TableName: tableName,
                Key: {
                    maXe: data.Items[0].maXe,
                    tenDongXe: data.Items[0].tenDongXe
                }
            }, (err, data) => {
                if(err) {
                    console.log("Delete error");
                    return res.redirect('/');
                } else {
                    console.log("Delete succeeded");
                    return res.redirect('/');
                }
            })
        }
    });
})

app.listen(port, () => {
    console.log("Server is running ", port);
})