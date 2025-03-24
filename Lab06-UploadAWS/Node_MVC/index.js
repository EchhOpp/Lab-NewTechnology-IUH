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

app.post("/save", (req, res) => {
    const params= {
        TableName: tableName,
        Item: {
            id: String(Date.now()),
            ...req.body
        }
    }
    console.log(JSON.stringify(req.body))
    docClient.put(params, (err, data) => {
        if(err) {
            console.error(err);
            return;
        } else {
            console.log("Save succeeded: ", JSON.stringify(data, null, 2));
            res.redirect("/");
        }
    })
});

app.post("/delete/:id", (req, res) => {
    console.log("detele id: ", req.params.id)
    const params = {
        TableName: tableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": req.params.id
        }
    };

    docClient.query(params, (err, data) => {
        if(err){
            console.error("Error scanning table ", err);
            return res.redirect("/");
        } 
        const paramsDelete = {
            TableName: tableName,
            Key: {
                id: data.Items[0].id,
                name: data.Items[0].name
            }
        }
        docClient.delete(paramsDelete, (err, data) => {
            if(err) {
                console.error(err);
                return res.redirect("/");
            } else {
                console.log("delete succeeded!");
                return res.redirect("/");
            }
        })
    });
});

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})