const mongoose = require('mongoose');

const Inventory = mongoose.model('Inventory', {
    kode_material: {
        type: String,
        required: true,
    },
    nama_material: {
        type: String,
        required: true,
    },
    qty_stock: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },  location: {
        type: String,
        required: true,
    },  url: {
        type: String,
        required: true,
    }, 
     history: {
        type: Array,
    }
    

});

module.exports = Inventory;