const express = require('express');
const mongoose = require('mongoose');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession)
const passport = require('passport');
const flash = require('connect-flash');
const multer= require('multer');
const path= require('path');
const app = express();
const csvModel=require('./model/csv');
const csv= require('csvtojson');
const bodyParser= require('body-parser');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const uploads=multer({storage:storage});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views',);

app.use(express.urlencoded({ extended: true }));

// const mongoURI = require('./config/monkoKEY');
mongoose.connect("mongodb+srv://mayank:govind@2001@cluster0.7dmc8.mongodb.net/flooddata?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, },).then(() => console.log("Connected !"),);

app.use(cookieParser('random'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.resolve(__dirname,'public')));
app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new MemoryStore(),
}));

app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    next();
});

app.use(require('./controller/routes.js'));
 
app.post('/', uploads.single('csv'), (req, res, next) => {

    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    //convert csvfile to jsonArray   
    csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            console.log(jsonObj);
            const mydata = new csvModel({
                
                csvdata: jsonObj

            })

            mydata.save(mydata).then(data => {
                // res.send(data)

                ("./" + fs.unlinkSync(req.file.path));
                res.redirect('/profile');
            })
                .catch((error) => {
                    res.status(500).send({
                        message: error.message || "Some error occurred while creating a create operation"
                    });
                });

        });

});
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));