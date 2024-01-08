import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from 'path'
const app = express();
app.use(cors());
app.use(fileUpload());
const __dirname = new URL(".", import.meta.url).pathname
console.log(__dirname)
app.use(express.static(path.resolve(__dirname,"../public")));

// app.get("/", (req, res) => res.send("Hola"));

app.post("/", (req, res) => {
  const file = req.files.archivo;
  console.log(file);

  file.mv(`./files/${file.name}`, (err) => {
    if (err) return res.status(500).send({ message: err });
    res.send({ message: "File Upload" });
  });
});

app.listen(3000, () => console.log("ya"));