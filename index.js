const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`));

// 1) bikin proses put/edit data sukses sampai data nya teredit di file json nya
app.put("/person/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = persons.findIndex((element) => element.id === id);
  const person = persons.find((el) => el.id === id);

  if (!person) {
    res.status(400).json({
      status: "failed",
      message: `person dengan id ${id} tersebut invalid/gak ada`,
    });
  } else {
    if (index >= 0) {
      persons[index].name = req.body.name;
      persons[index].age = req.body.age;
      persons[index].eyeColor = req.body.eyeColor;
    }
    fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), (errr) => {
      res.status(200).json({
        status: "success",
        message: `data dari id ${id} nya berhasil berubah`,
      });
    });
  }
});

// 2) bikin validasi jika id tidak ditemukan dari params id nya di api get data by id, delete dan put

// get data by id
// app.get("/person/:id", (req, res) => {
//   const id = req.params.id * 1;
//   const person = persons.find((el) => el.id === id);

//   if (!person) {
//     res.status(400).json({
//       status: "failed",
//       message: `person dengan id ${id} tidak ditemukan`,
//     });
//   }
// });

// delete data by id
// app.delete("/person/:id", (req, res) => {
//   const id = req.params.id * 1;
//   const person = persons.find((el) => el.id === id);

//   if (!person) {
//     res.status(400).json({
//       status: "failed",
//       message: `person dengan id ${id} tidak ditemukan`,
//     });
//   }
// });

// put data by id
// app.put("/person/:id", (req, res) => {
//   const id = req.params.id * 1;
//   const person = persons.find((el) => el.id === id);

//   if (!person) {
//     res.status(400).json({
//       status: "failed",
//       message: `person dengan id ${id} tidak ditemukan`,
//     });
//   }
// });

// 3) bikin validasi di create/edit API utk request body
app.post("/person", (req, res) => {
  // console.log(persons.length - 1);
  const newId = persons.length - 1 + 10;
  const newPerson = Object.assign({ id: newId }, req.body);

  // validasi kalau name nya udh ada, maka gk bisa create data baru
  const personName = persons.find((el) => el.name === req.body.name);
  // console.log(personName);

  const cukupUmur = req.body.age < 20;

  if (personName) {
    res.status(400).json({
      status: "failed",
      message: `name ${req.body.name} already exist`,
    });
  } else if (cukupUmur) {
    res.status(400).json({
      status: "failed",
      message: `umur ${req.body.age} belum cukup`,
    });
  } else {
    persons.push(newPerson);
    fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), (errr) => {
      res.status(201).json({
        status: "success",
        data: {
          person: newPerson,
        },
      });
    });
  }
});

// memulai server nya
app.listen(PORT, () => {
  console.log(`App running on Localhost: ${PORT}`);
});
