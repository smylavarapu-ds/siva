/**
 * New script file
 */

const WebSocket = require('ws');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://test:test@ds125422.mlab.com:25422"


const ws = new WebSocket('ws://127.0.0.1:3000');

ws.on('message', function incoming(json) {
  let data = JSON.parse(json);
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var collection = db.collection('borrowers'); 
  collection.insert(data);
  db.close();
   });
});
  


