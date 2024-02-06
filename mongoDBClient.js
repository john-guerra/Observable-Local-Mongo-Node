import { MongoClient } from "mongodb";

function MyMongoDB() {
  const myDB = {};
  let url;
  myDB.init = async (url_) => {
    try {
      url = url_;
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, error: err };
    }
  };

  myDB.find = async (dbName, collectionName, query = {}, options = {}) => {
    let res, client;
    try {
      client = new MongoClient(url, { connectTimeoutMS: 1000 });
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      res = await collection.find(query, options).toArray();
    } catch (err) {
      console.error(err);
      return err;
    } finally {
      await client.close();
      return res;
    }
  };

  myDB.insert = async (dbName, collectionName, data = {}) => {
    let res, client;
    try {
      client = new MongoClient(url, { connectTimeoutMS: 1000 });
      await client.connect();
      const db = client.db(dbName);
      const collection = await db.collection(collectionName);
      res = await collection.insertMany(data);
    } catch (err) {
      console.error(err);
      return err;
    } finally {
      await client.close();
      return res;
    }
  };

  myDB.aggregate = async (dbName, collectionName, query = {}) => {
    let res, client;
    try {
      client = new MongoClient(url, { connectTimeoutMS: 1000 });
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      res = await collection.aggregate(query).toArray();
      await client.close();

      return res;
    } catch (err) {
      console.error(err);
      return err;
    } finally {
      await client.close();
      return res;
    }
  };

  myDB.delete = async (dbName, collectionName, query = {}) => {
    let res, client;
    try {
      client = new MongoClient(url, { connectTimeoutMS: 1000 });
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      res = await collection.deleteMany(query);
    } catch (err) {
      console.error(err);
      return err;
    } finally {
      await client.close();
      return res;
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
