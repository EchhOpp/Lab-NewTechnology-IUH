const express = require('express');
const PORT = 3000;
const app = express();
let courses = require('./data')

// register middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

// config view

app.set('view engine', 'ejs');
app.set('views', './views');

// API

app.get('/', (req, res) => {
    return res.render('index', { courses })
});

app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}`);
})