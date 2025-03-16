const express = require('express');
const app = express();
const PORT = 3000;
let courses = require('./data');

// register middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./views'));

// config view
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', { courses });
});

app.post('/save', (req, res) => {
    const { name, course_type, semester, department } = req.body;
    const id = courses.length + 1;
    courses.push({ id, name, course_type, semester, department });
    console.log(courses);
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    courses = courses.filter(course => course.id !== parseInt(id));
    res.redirect('/'); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});