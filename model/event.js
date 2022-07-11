const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true,
    },
   venue: {
        type: String,
        required: true,
    },
   guest: {
        type: String,
        required: true,
    },

    
});

module.exports = mongoose.model('event', eventSchema);