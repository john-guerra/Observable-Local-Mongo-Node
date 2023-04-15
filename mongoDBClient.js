import { MongoClient } from "mongodb";

function MyMongoDB() {
  const myDB = {};
  let client;
  myDB.init = async (url) => {
    try {
      client = new MongoClient(url, { connectTimeoutMS: 1000 });
      await client.connect();
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, error: err };
    }
  };

  myDB.find = async (dbName, collectionName, query = {}, options = {}) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      let res = await collection.find(query, options).toArray();
      return res;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  myDB.insert = async (dbName, collectionName, data = {}) => {
    try {
      const db = client.db(dbName);
      const collection = await db.collection(collectionName);
      let res = await collection.insertMany(data);
      return res;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  myDB.aggregate = async (dbName, collectionName, query = {}) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      let res = await collection.aggregate(query).toArray();
      return res;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  myDB.delete = async (dbName, collectionName, query = {}) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      let res = await collection.deleteMany(query);
      return res;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  myDB.closeConnection = async () => {
    try {
      await client.close();
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  // https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
  myDB.listDatabases = async (client) => {
    return client.db().admin().listDatabases();
  };

  return myDB;
}

export const databaseManager = MyMongoDB();
