require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const {
    tableName,
    docClient,
    s3
} = require("./helper/aws.helper")

//config 
app.use(express.urlencoded({extended: false}));
app.use(express.static("./views"))
app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/", (req, res) => {
    docClient.scan({TableName: tableName}, (err, data) => {
        if(err) {
            console.error("Scan to table error");
            console.log(err);
            return;
        } else {
            console.log("Scan Succeeded");
            res.render('index', {
                courses: data.Items
            });
        }
    })
});

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})