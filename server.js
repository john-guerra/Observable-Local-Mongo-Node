import express from "express";
import { databaseManager } from "./mongoDBClient.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

let corsOptions = {
  origin: function (origin, callback) {
    // Accept connections from Observable
    if (origin.endsWith("static.observableusercontent.com")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 5001;

app.get("/api/test", async (req, res) => {
  res.status(200).json({ status: "You are connected to the API 👍"});

});

app.post("/api/init", async (req, res) => {
  let body = req.body;
  console.log(body);
  let { url } = body;
  console.log("Received init request", url);
  let result;

  try {
    result = await databaseManager.init(url);
  } catch (e) {
    console.log("Error", e);
    res.status(400).json({error: e})
  } finally {
    res.status(200).json(result);
  }
});

app.post("/api/insert", async (req, res) => {
  let { db, collection, data } = req.body;
  console.log("Received Insert request", db, collection, data);
  let result = await databaseManager.insert(db, collection, data);
  res.status(200).json(result);
});

app.post("/api/find", async (req, res) => {
  let { db, collection, query } = req.body;
  console.log("Received Find request", db, collection, query);
  let result = await databaseManager.find(db, collection, query);
  res.status(200).json(result);
});

app.get("/api/closeConnection", async (req, res) => {
  console.log("Received Close Connection request");
  let result = await databaseManager.closeConnection();
  res.status(200).json(result);
});

app.post("/api/delete", async (req, res) => {
  let { db, collection, query } = req.body;
  console.log("Received Find request", db, collection, query);
  let result = await databaseManager.delete(db, collection, query);
  res.status(200).json(result);
});

// app.get("/api/delete", async (req, res) => {
//   let body = req.body;
//   console.log("Received Delete request", body);
//   let result = await databaseManager.delete();
//   res.status(200).json(result);
// });

app.listen(PORT, console.log(`Mongodb Server running on port ${PORT}`));
