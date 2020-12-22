const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb://dbUser:dbPassword@cluster0.sktvc.mongodb.net/dbkli?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    db = client.db("dbkli").collection("kli");
    app.listen(5000, function() {
        console.log("Сервер запущен на порте 5000");
    });
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    db.find().toArray((err, results) => {
        res.render('index.ejs', { cds: results });
    });
});

app.get("/insert", (req, res) => {
    res.render("insert.ejs");
});

app.get("/edit", (req, res) => {
    res.render("edit.ejs");
});

app.get("/search", (req, res) => {
    res.render("search.ejs");
});

app.post('/show', (req, res) => {
    db.find(req.body).toArray((err, results) => {
        res.render('show.ejs', { cds: results });
    });
});

app.post("/insert", (req, res) => {
    db.insertOne(req.body, (err, result) => {
        res.redirect("/");
    });
});

app.route('/edit/:id')
    .get((req, res) => {
        db.find(ObjectId(req.params.id)).toArray((err, result) => {
            res.render('edit.ejs', { cds: result });
        });
    })
    .post((req, res) => {
        db.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: {
                name: req.body.name,
                kodkl: req.body.kodkl,
                bank: req.body.bank,
                kredit: req.body.kredit
            }
        }, (err, result) => {
            res.redirect('/');
        })
    });

//DELETE
app.get("/delete/:id", (req, res) => {
    db.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
        res.redirect('/');
    });
});