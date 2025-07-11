const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));


// CREATE the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '9090704599',
});

// faker function
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Home Route - Show count
app.get('/', (req, res) => {
  let q = `SELECT count(*) AS count FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0].count;
      res.render('home.ejs', { count });
    });
  } catch (err) {
    console.log(err);
    res.send('Some error in DB');
  }
});

// Show Users
app.get('/user', (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render('show.ejs', { users });
    });
  } catch (err) {
    console.log(err);
    res.send('Some error in DB');
  }
});

// Newuser (GET form)
app.get('/user/new', (req, res) => {
  res.render('new.ejs');
});

// Add newuser 
app.post('/user', (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.string.uuid();
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect('/user');
    });
  } catch (err) {
    console.log(err);
    res.send('Error adding user');
  }
});

// Edit User
app.get('/user/:id/edit', (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render('edit.ejs', { user });
    });
  } catch (err) {
    console.log(err);
    res.send('Some error in DB');
  }
});

// Update User
app.patch('/user/:id', (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send('Wrong password.');
      } else {
        let q2 = `UPDATE user SET username= '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect('/user');
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send('Some error in DB');
  }
});

// Delete User
app.delete('/user/:id', (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect('/user');
    });
  } catch (err) {
    console.log(err);
    res.send('Some error in DB');
  }
});

let port = 8080;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}.`);
});

































// INSERT new data 

// Single data
//let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";  
//let user = ["101", "Rajesh", "rajesh04@gmail.com", "1234"];

// Multiple data
//let q = "INSERT INTO user (id, username, email, password) VALUES ?" ; 
//let users = [
  //["101", "Rajesh", "rajesh04@gmail.com", "143"],
  //["102", "Ritika", "ritu26@gmail.com", "1432"]
//];

// INSERT Data from Faker
//let q = "INSERT INTO user (id, username, email, password) VALUES ?" ; 

//let data = [];
//for(let i=1; i<=100; i++) {
  //data.push(getRandomUser());
//}

//try {
    //connection.query( q, [data],  (err,result) => {
        //if(err) throw err;
        //console.log(result);
    //});
//} catch (err) {
    //console.log(err);
//}

//connection.end();
