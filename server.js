const exppress = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');


const app = exppress();
app.use(cors());
app.use(exppress.json());
app.use(exppress.static(path.join(__dirname, 'public')));
app.use(exppress.urlencoded({ extended: true }));


const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'movie_info'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/movie', (req, res) => {

    const query = 'SELECT movie.Movie_ID, movie.Movie_Name, movie.Genre, movie.Year, movie.IMDb_Rating, director.Director_Name FROM movie JOIN director ON movie.Director_ID = director.Person_ID';
    db.query(query, (err, results) => {
        if (err) {console.error('Erroer fetching data from the database:', err);
res.status(500).send('Erroer fetching data from the database');
        }
        else {
            res.json(results);
        }
    });
});

app.post('/addmovie', (req, res) => {
    const { Movie_Name, Genre, Year, IMDb_Rating, Director_ID } = req.body;
const query = 'INSERT INTO movie (Movie_Name, Genre, Year, IMDb_Rating, Director_ID) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [Movie_Name, Genre, Year, IMDb_Rating, Director_ID], (err, results) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Error inserting data into the database');
        } else {
            res.status(200).send('Movie added successfully');
        }
    });


});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});