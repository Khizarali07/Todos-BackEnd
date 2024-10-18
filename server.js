const mongo = require("mongodb");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

(async function fun() {
  const url =
    "mongodb+srv://khizarali:<db_password>@cluster0.hod0c.mongodb.net/todos?retryWrites=true&w=majority&appName=Cluster0";
  const con = await mongo.MongoClient.connect(url);
  const db = con.db("todos");

  await app.post("/task", (req, res) => {
    const { task, date, complete } = req.body;
    const data = { task, date, complete };
    const insert = db.collection("list").insertOne(data);
  });
  await app.post("/complete", (req, res) => {
    const { complete, task } = req.body;
    const comp = db
      .collection("list")
      .updateOne({ task }, { $set: { complete } });
  });
  await app.post("/delete", (req, res) => {
    const { date } = req.body;
    const comp = db.collection("list").deleteOne({ date });
  });

  await app.get("/tasks", async (req, res) => {
    const alltask = db.collection("list").find();
    let arr = [];
    let i = 0;
    await alltask.forEach((doc) => {
      arr[i++] = doc;
      console.log(arr);
    });
    await res.status(200).json(arr);
  });

  await app.get("/pending", async (req, res) => {
    const alltask = db.collection("list").find({ complete: "uncomplete" });
    let arr = [];
    let i = 0;
    await alltask.forEach((doc) => {
      arr[i++] = doc;
      console.log(arr);
    });
    await res.status(200).json(arr);
  });

  await app.get("/completing", async (req, res) => {
    const alltask = db.collection("list").find({ complete: "complete" });
    let arr = [];
    let i = 0;
    await alltask.forEach((doc) => {
      arr[i++] = doc;
      console.log(arr);
    });
    await res.status(200).json(arr);
  });

  // app.get("/", (req, res) => {
  //     app.use(express.static(path.resolve(__dirname, "front-end", "build")));
  //     res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
  //   });

  app.listen(3000);
})();
