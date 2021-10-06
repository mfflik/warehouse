const mongoose = require('mongoose');

const Production = mongoose.model('Production', {
    no_prod: {
        type: String,
        required: true,
    },
    kode_produk: {
        type: String,
        required: true,
    },
    nama_produk: {
        type: String,
        required: true,
    },
    qty_po: {
        type: String,
        required: true,
    },
    status_po: {
        type: String,
        required: true,
    },
    persentase: {
        type: String,
    },
    no_gi: {
        type: String,
    },
    no_gr: {
        type: String,
    },
    no_tfp: {
        type: String,
    },
    keterangan: {
        type: String,
    },
    tgl_po: {
        type: Date,
        required: true,
    },   
    tgl_po2: {
        type: Date,
    },
     material: {
        type: Array,
    },
    

});

module.exports = Production;