const { database } = require("firebase-admin");
const admin = require("firebase-admin");
const config = require("../config");

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
  databaseURL: "http://coderecommerce.firebaseio.com",
});

const db = admin.firestore();

class Contenedor {
  constructor(collection) {
    this.collection = db.collection(collection);
  }

  async save(obj) {
    await this.collection.add(obj);
  }

  async getById(id) {
    let doc = await this.collection.doc(id).get();
    return doc;
  }

  async getAll() {
    let result = [];
    let snapshot = await this.collection.get();
    snapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    return result;
  }

  async update() {}

  async delete() {}
}

module.exports = Contenedor;