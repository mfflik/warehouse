const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
    kode_produk: {
        type: String,
        required: true,
    },
    nama_produk: {
        type: String,
        required: true,
    },
     material: {
        type: Array,
    },
    keterangan: {
        type: String,
    },

});

module.exports = Product;