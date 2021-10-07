const express = require("express");
const expressLayouts = require("express-ejs-layouts");
var session = require('cookie-session');
const methodOverride = require("method-override");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

require("./utils/db");
const Inventory = require("./model/inventory");
const Product = require("./model/product");
const Purchase = require("./model/purchase");
const Production = require("./model/production");

const app = express();
const port = 8080;

// Setup Ejs
app.set("view engine", "ejs");
app.use(expressLayouts); //third party mw
app.use(express.static("public")); // Build-in midleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Konfig Flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index", {
    title: "Dashboard",
    nav: {
      index: "nav-item active",
      inventory: "nav-item",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",
    
  });
});

app.get("/inventory", async (req, res) => {
  const inventory = await Inventory.find();

  res.render("inventory", {
    title: "Inventory",
    nav: {
      index: "nav-item ",
      inventory: "nav-item active",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",
    inventory,
    msg: req.flash("msg"),
  });
});

app.get("/inventory/add", (req, res) => {
  res.render("inventory-add", {
    title: "Inventory Add",
    nav: {
      index: "nav-item ",
      inventory: "nav-item active",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",
    msg: req.flash("msg"),
  });
});

app.post("/inventory", async (req, res) => {
  
  let i = 0;
  let jumlah;
  let date = new Date();
  const tgl = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  do {
    i++;
  } while (req.body[`kode-material` + i] != undefined);
  jumlah = i;

  console.log(jumlah);
  for (let j = 0; j < jumlah; j++) {  
    // try { const inventory = await Inventory.findOne({ kode_material: req.body[`kode-material` + j] });
    // if (inventory.kode_material!=req.body[`kode-material` + j]){}
  
  // }catch (e) {
    console.log(req.body[`kode-material` + j]);
  // if (inventory.kode_material!=req.body[`kode-material` + j]||inventory==undefined){
    try {
      Inventory.insertMany({
        kode_material: req.body[`kode-material` + j],
        nama_material: req.body[`nama-material` + j],
        qty_stock: req.body[`qty-stock` + j],
        unit: req.body[`unit` + j],
        history: `${tgl} , Input ${req.body[`qty-stock` + j]}  ${
          req.body["unit" + j]
        }`,
      });
    } catch (e) {
      // console.log(e)
  req.flash("msg", e);
  // res.redirect("/inventory");
    }
}
req.flash("msg", "Data Inventory berhasil ditambahkan");
  // }
  res.redirect("/inventory");
});

//proses ubah data
app.put(
  "/inventory",
  async (req, res) => {
    const duplikat = await Inventory.findOne({
      kode_material: req.body.kode_material,
    });
    //  if (req.body.name  !== req.body.oldNama && duplikat) {
    //  console.log("a")
    // };
    //  console.log(Error)
    // if (!errors.isEmpty()) {
    //   res.render("edit-contact", {
    //     title: "Form Ubah Data Contact",
    //     layout: "layouts/main-layout",
    //     errors,
    //     contact: req.body,
    //   });
    // } else {
    console.log(duplikat);

    let date = new Date();
    const tgl = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    var history = duplikat.history;
    history.push(`${tgl} , Edit ${req.body.qty_stock} ${req.body.unit}`);
    Inventory.updateOne(
      { _id: req.body._id },
      {
        $set: {
          kode_material: req.body.kode_material,
          nama_material: req.body.nama_material,
          qty_stock: req.body.qty_stock,
          unit: req.body.unit,
          history,
        },
      }
    ).then((result) => {
      console.log("berhasil");
      // req.flash("msg", "Data Contact berhasil diubah");
      res.redirect("/inventory");
    });
  }
  // }
);

app.delete("/inventory", (req, res) => {
  Inventory.deleteOne({ kode_material: req.body.kode_material }).then(
    (result) => {
      res.redirect("/inventory");
    }
  );
});

app.get("/inventory/:kode_material", async (req, res) => {
  const inventory = await Inventory.findOne({
    kode_material: req.params.kode_material,
  });

  res.render("inventory-edit", {
    title: "Edit Inventory",
    layout: "layouts/main-layout",
    nav: {
      index: "nav-item ",
      inventory: "nav-item active",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item",
    },
    inventory,
  });
});

app.get("/purchase", async (req, res) => {
  const purchase = await Purchase.find();

  res.render("purchase", {
    title: "Purchase",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item active",
      production: "nav-item ",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",
    purchase,
  });
});

app.get("/purchase/add", (req, res) => {
  res.render("purchase-add", {
    title: "Purchase Add",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item active",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",
  });
});

app.post("/purchase", (req, res) => {
  let i = 0;
  let material = [];
  // let material2=[];

  console.log(req.body);
  do {
    material.push({
      kode_material_bom: req.body["kode_material" + i],
      // nama_material_bom:req.body[`nama_material`+i],
      qty_order: req.body[`qty_order` + i],
      // unit_bom:req.body[`unit` + i],
    });
    i++;
  } while (req.body[`kode_material` + i] != undefined);
  jumlah = i;

  material.forEach(async (a, index) => {
    const item = await Inventory.findOne({
      kode_material: a.kode_material_bom,
    });
    let stock = Number(item.qty_stock) + Number(a.qty_order);
    let date = new Date();
    const tgl = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    a.nama_material = item.nama_material;
    a.unit = item.unit;

    let jumlah = material.length - 1;
    var history = item.history;
    history.push(
      `${tgl} , No Po  ${req.body[`no_po`]} stock ${item.qty_stock} + ${
        a.qty_order
      } = ${stock} ${item.unit}`
    );
    Inventory.updateOne(
      { kode_material: a.kode_material_bom },
      {
        $set: {
          qty_stock: stock,
          history,
        },
      }
    ).then((result) => {
      if (index == jumlah) {
        console.log(material);
        try {
          Purchase.insertMany({
            no_purchase: req.body[`no_po`],
            mat_doc: req.body[`mat_doc`],
            keterangan: req.body[`keterangan`],
            tgl_po: req.body[`tgl_po`],
            tgl_gr: req.body[`tgl_gr`],
            material,
          });
        } catch (e) {
          console.log(e);
        }

        res.redirect("/purchase");
      }
    });
    // console.log(a);
  });
});

app.delete("/purchase", (req, res) => {
  Purchase.deleteOne({ no_purchase: req.body.no_purchase }).then((result) => {
    res.redirect("/purchase");
  });
});

app.get("/production", async (req, res) => {
  const production = await Production.find();

  res.render("production", {
    title: "Production",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item",
      production: "nav-item active",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",

    production,
  });
});

app.get("/production/add", (req, res) => {
  res.render("production-add", {
    title: "Production Add",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item ",
      production: "nav-item active",
      output: "nav-item",
      product: "nav-item",
    },
    layout: "layouts/main-layout",
  });
});

app.post("/production", (req, res) => {
  let i = 0;
  let material = [];

  console.log(req.body);
  do {
    material.push({
      kode_material_bom: req.body["kode_material" + i],
      // nama_material_bom: req.body[`nama_material` + i],
      qty_bom: req.body[`qty_bom` + i],
      qty_all: req.body[`qty_all` + i],
      qty_order: req.body[`qty_bom` + i],
      // unit_bom: req.body[`unit` + i],
    });
    i++;
  } while (req.body[`kode_material` + i] != undefined);
  jumlah = i;

  material.forEach(async (a,index) => {
    const item = await Inventory.findOne({
      kode_material: a.kode_material_bom,
    });
    let stock = Number(item.qty_stock) - Number(a.qty_order);
    let date = new Date();
    const tgl = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    a.nama_material = item.nama_material;
    a.unit = item.unit;

    let jumlah = material.length - 1;
    var history = item.history;
    history.push(
      `${tgl} , Production ${req.body[`no_po`]} stock ${item.qty_stock} - ${
        a.qty_order
      } = ${stock} ${item.unit}`
    );
    Inventory.updateOne(
      { kode_material: a.kode_material_bom },
      {
        $set: {
          qty_stock: stock,
          history,
        },
      }
    ).then((result) => {
      if (index == jumlah) {
      try {
        Production.insertMany({
          no_prod: req.body[`no_po`],
          kode_produk: req.body[`kode_produk`],
          nama_produk: req.body[`nama_produk`],
          qty_po: req.body[`qty_po`],
          status_po: req.body[`status_po`],
          tgl_po: req.body[`tgl_po`],
          tgl_po2: req.body[`tgl_po2`],
          no_gi: req.body[`no_gi`],
          no_gr: req.body[`no_gr`],
          no_tfp: req.body[`no_tfp`],
          keterangan: req.body[`keterangan`],
          material,
        });
      } catch (e) {
        console.log(e);
      }
      res.redirect("/production");
      }
    });
    
    // console.log(a);
  });
});

app.delete("/production", (req, res) => {
  Production.deleteOne({ no_prod: req.body.no_prod }).then((result) => {
    res.redirect("/production");
  });
});

app.get("/product", async (req, res) => {
  const product = await Product.find();
  res.render("product", {
    title: "Product",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item active",
    },
    layout: "layouts/main-layout",
    product,
  });
});

app.get("/product/add", (req, res) => {
  res.render("product-add", {
    title: "Product Add",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item active",
    },
    layout: "layouts/main-layout",
  });
});

app.post("/product", (req, res) => {
  let i = 0;
  let material = [];

  let material2 = [];
  console.log(req.body);
  do {
    material.push({
      kode_material_bom: req.body["kode_material" + i],
      // nama_material_bom:req.body[`nama_material`+i],
      qty_bom: req.body[`qty` + i],
      // unit_bom:req.body[`unit` + i],
    });
    i++;
  } while (req.body[`kode_material` + i] != undefined);
  jumlah = i;
  material.forEach(async (a, index) => {
    const item = await Inventory.findOne({
      kode_material: a.kode_material_bom,
    });
    a.nama_material = item.nama_material;
    a.unit = item.unit;
    let jumlah = material.length - 1;
    console.log(material.length - 1);
    console.log(index);
    material2.push({
      kode_material_bom: a.kode_material_bom,
      nama_material_bom: item.nama_material,
      qty_bom: a.qty_bom,
      unit_bom: item.unit,
    });
    if (index == jumlah) {
      console.log(material);
      try {
        Product.insertMany({
          kode_produk: req.body[`kode_produk`],
          nama_produk: req.body[`nama_produk`],
          keterangan: req.body[`keterangan`],
          material:material2,
        });
      } catch (e) {
        console.log(e);
      }
    }
  });

  // await console.log(material2);

  res.redirect("/product");
});

app.get("/produk/:kode_produk", async (req, res) => {
  const produk = await Produk.findOne({ kode_produk: req.params.kode_produk });

  res.render("product-edit", {
    title: "Edit Inventory",
    layout: "layouts/main-layout",
    nav: {
      index: "nav-item ",
      inventory: "nav-item ",
      purchase: "nav-item",
      production: "nav-item",
      output: "nav-item",
      product: "nav-item active",
    },
    produk,
  });
});

app.get("/product/:kode_produk", async (req, res) => {
  const product = await Product.find({ kode_produk: req.params.kode_produk });
  res.send(product[0]);
});

app.delete("/product", (req, res) => {
  Product.deleteOne({ kode_produk: req.body.kode_produk }).then((result) => {
    res.redirect("/product");
  });
});

app.get('/dataserver', (req, res) => {
  // res.statusCode=200;
  // res.sendStatus(200);
   res.send({nama:"Hello Worlda!@"})
});


app.post('/digitalupload', (req, res) => {
  // res.statusCode=200;
  // res.sendStatus(200);
   res.send({nama:"Hello Worlda!@"})
});


app.listen(port, () => {
  console.log(`Warehouse System | listening at http://localhost:${port}`);
});
