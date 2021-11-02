
const multer = require("multer");

const Inventory = require("../model/inventory");

//upload Image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/image");
    },
    filename: function (req, file, cb) {
      cb(null, `${req.body.kode_material}.jpg`);
    },
  });
  
  const uploadImg = multer({ storage: storage }).single("image");
  let date = new Date();
  const tgl = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  //POST tea
  const newInventory = (req, res) => {
    Inventory.findOne({ kode_material: req.body.kode_material }, (err, data) => {
      if (!data) {
        const newInv = new Inventory({
          kode_material: req.body.kode_material,
          nama_material: req.body.nama_material,
          qty_stock: req.body.qty_stock,
          unit: req.body.unit,
          location: req.body.location,
          deskripsi: req.body.deskripsi,
          url:`https://ileaa.herokuapp.com/image/${req.body.kode_material}.jpg`,
          history: {
            tanggal: tgl,
            masuk: req.body.qty_stock,
            keluar:"",
            saldo: req.body.qty_stock,
            user:req.body.user,
            keterangan:"New Input",
          },
        });
        //save to database
        // newInv.save((err, data) => {
        //   if (err) return res.json("Something is wrong. Please check.");
        //   return res.json(data);
        // });
        try {
            Inventory.insertMany(newInv);
          } catch (e) {
            console.log(e);
          }
        return res.json("New Inventory is created.");
      } else {
        if(err) return res.json(`Something went wrong, please try again. ${err}`);
        return res.json(`${req.body.kode_material} inv already exists.`);
      }
    });
  };
  
  module.exports = {

    uploadImg,
    newInventory
  };
  