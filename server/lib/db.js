const MongoClient = require('mongodb').MongoClient;
const config = require('kelp-config');
const assert = require('assert');
const { log, loge } = require('./utils');

const dbConfig = config.db;

class Db {
  constructor(host, port) {
    if (!(this instanceof Db)) {
      return new Db(host, port);
    }
    const dbUrl = `mongodb://${host}:${port}`;
    MongoClient.connect(dbUrl, (err, client) => {
      assert.equal(null, err);
      log('MongoDB connected!');

      this.client = client;
      this.db = client.db(dbConfig.database);
      this.collection = this.db.collection(dbConfig.collection);
    });
  }

  async exist(isbn13) {
    const book = await this.collection.find({ isbn13 }).toArray();
    return book.length !== 0;
  }

  add(obj) {
    return this.collection.insertOne(obj);
  }

  delete(isbn13) {
    return this.collection.deleteOne({ isbn13 });
  }

  async update(isbn13, data) {
    return await this.collection.findOneAndUpdate({ isbn13 }, {
      $set: {
        ...data,
        update_date: new Date()
      }
    }).then(doc => doc)
      .catch(err => loge('db update err: ' + isbn13 + ', ' + err.message));
  }

  async search(condition) {
    return await new Promise(resolve => {
      this.collection.find(condition).sort('insert_date', -1).toArray((err, docs) => {
        if(err) {
          loge('db search err: ' + condition + ' ' + err.message);
          resolve([]);
        }
        resolve(docs);
      });
    });
  }

  close() {
    this.client.close((err) => {
      assert.equal(null, err);
      log('db client closed');
    });
  }
}

module.exports = new Db(dbConfig.host, dbConfig.port);