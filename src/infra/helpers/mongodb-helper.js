const { MongoClient } = require('mongodb');

class MongoHelper {
  static async connect(uri) {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = this.client.db();
  }

  static async disconnect() {
    await this.client.close();
  }

  static async getCollection(collectionName) {
    return this.db.collection(collectionName);
  }
}

module.exports = { MongoHelper };
