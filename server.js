const bodyParser = require('body-parser');
const exp = require('constants');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const { isNull } = require('util');
const { resourceLimits } = require('worker_threads');
const MongoClient = require('mongodb').MongoClient;
const corsOptions = { origin: 'http://localhost:8080', credentials: true };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
var db;
const dbconnection = MongoClient.connect('mongodb+srv://admin:1234@cluster0.rdtuh5c.mongodb.net/?retryWrites=true&w=majority', function(err, client) {
    if (err) {
        return console.log(err);
    }
    db = client.db('aoror');
    console.log("마리아디비가 열렸습니다.");
    app.listen(port, function() {
        console.log('succed');
    })
})
app.get('/', function(req, res) {
    db.collection("documents").find().sort({ _id: 1 }).toArray(async function(err, result) {
        await res.render("main.ejs", { documents: result });
    })
})
app.get('/write', function(req, res) {
    res.render("write.ejs");
})
app.post('/add', function(req, res) {
    db.collection('documents').findOne({ _id: req.body.title }, async function(err, result) {
        if (result == null) {
            await db.collection('documents').insertOne({ _id: req.body.title, tearbig: req.body.tearbig, tearsmall: req.body.tearsmall, answer: req.body.answer, testcase: req.body.testcase }, async function(err, result) {
                console.log("accepted");
                await res.redirect('/');
            });
        } else {
            console.log("이미 있는 값입니다.");
        }
    });

})

app.get('/find/:id', function(req, res) {
    db.collection("documents").findOne({ _id: req.params.id }, async function(err, result) {
        console.log(result);
        await res.render("find.ejs", { documents: result });
    });
})

app.get('/edit/:id', function(req, res) {
    db.collection("documents").findOne({ _id: req.params.id }, async function(err, result) {
        await res.render("edit.ejs", { edits: result });
    })
})

app.put('/edit', function(req, res) {
    db.collection("documents").updateOne({ _id: req.body.title }, { $set: { tearbig: req.body.tearbig, tearsmall: req.body.tearsmall, answer: req.body.answer, testcase: req.body.testcase } }, async function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("value revision accepted");
            await res.redirect('/');
        }
    })
})

app.post('/finder', function(req, res) {
    console.log(req.body);
    if (req.body.searcher != '') {
        res.redirect('/find/' + req.body.searcher);
    } else {

        res.redirect('/');
    }
})