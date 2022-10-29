const { MongoClient } = require('mongodb');

class MongoHelper {
  static async connect(uri, dbName) {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = this.client.db(dbName);
  }

  static async disconnect() {
    await this.client.close();
  }
}

module.exports = { MongoHelper };
