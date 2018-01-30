const mongoose = require('mongoose');

const shortenSchema = new mongoose.Schema({ 
  fullURL: { type: String, required: true },
  shortURL: String
});

const Shorten = mongoose.model('Shorten', shortenSchema);

module.exports = Shorten;