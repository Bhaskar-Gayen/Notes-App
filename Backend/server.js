const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://vaskar:V1O5ZSkSJUgrgeH3@data-cluster.lp9ucxk.mongodb.net/?retryWrites=true&w=majority&appName=data-cluster";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema and model
const noteSchema = new mongoose.Schema({
  content: String,
});

const Note = mongoose.model("Note", noteSchema);

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Node running</h1>");
});

app.post("/add", async (req, res) => {
  try {
    const newNote = new Note({
      content: req.body.content,
    });
    const savedNote = await newNote.save();
    res.status(200).send(savedNote);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).send(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
