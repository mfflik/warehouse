const mongoose = require('mongoose');

const Purchase = mongoose.model('Purchase', {
    no_purchase: {
        type: String,
        required: true,
    },
    mat_doc: {
        type: String,
        required: true,
    }, 
    keterangan: {
        type: String,
    },
    tgl_gr: {
        type: Date,
    },
    tgl_po: {
        type: Date,
        required: true,
    },
     material: {
        type: Array,
        required: true,
    },
    

});

module.exports = Purchase;