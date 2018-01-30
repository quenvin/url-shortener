const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Shorten = require('./models/shorten.js')



const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://shorten:123@ds117848.mlab.com:17848/url_shortener');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.on('open', () => {
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
});

app.get('/', (req, res) => {
  res.render('index');
})

// app.post('/shorten', (req, res) => {
//   const shortURL = Math.random().toString(36).substr(2, 5)

//   Shorten.find({fullURL: fullURL}, (err, collection) => {
//     findFullURL:  for (i = 0; i < collection.length; i++) {
//       if (collection[i].fullURL === fullURL){
//         shortURL = collection[i].shortURL
//         break
//       }
//     }
//     console.log(collection.length)
//   })

//   Shorten.create({
//     fullURL: req.body.fullURL,
//     shortURL: shortURL
//   }, (err, document) => {
//     if (err) {
//       return console.log(err)
//     }
//     res.render('shorten', { shorten: document })
//     console.log(Shorten.length)
//   })
// })


app.post('/shorten', (req, res) => {
  const inputFullURL = req.body.inputFullURL
  Shorten.find({ fullURL: inputFullURL }, (err, result) => {
    if (result.length === 0) {
      Shorten.find({}, (err, docs) => {
        const newShortURL = "S" + docs.length.toString(36)
        Shorten.create({
          fullURL: req.body.inputFullURL,
          shortURL: newShortURL
        }, (err, document) => {
          if (err) {
            return console.log(err)
          }
          res.render('shorten', {fullURL: inputFullURL, shortURL: newShortURL})
        })
      })
    } else {
      res.render('shorten', {fullURL: inputFullURL, shortURL: result[0].shortURL})
    }
  })
})

app.get('/:inputURL', (req, res) => {
  let inputURL = req.params.inputURL
  Shorten.findOne({shortURL: inputURL}, (err, doc) => {
    if (doc) {res.redirect(doc.fullURL)
    } else {
    res.render('index', {invalidURL: inputURL})
    }
  })
})