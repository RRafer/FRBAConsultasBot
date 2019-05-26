const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//Estructura:
//userId - number
//chatIds - array de number
//privateChatId - number

exports.insertPrivateChat = (userId, privateChatId) => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');
      const col = db.collection('users');

      if(err) reject();
      col.find({'userId': userId}).count((error, result) => {
        if(error) reject();

        if(result > 0)
        {
          col.findOneAndUpdate({'userId': userId}, {$set: {'privateChatId': privateChatId}}, (error, result) => {            
            client.close()

            if(error) reject();

            resolve()
          });
        }
        else
        {
          col.insertOne({'userId': userId, 'chatIds': [], 'privateChatId': privateChatId}, (error, result) => {            
            client.close();

            if(error) reject();

            resolve();
          });
        }        
      });    
    });
  });
}

exports.insertChatId = (userId, chatId) => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');
      const col = db.collection('users');

      if(err) reject();
      
      col.findOne({'userId': userId}, (error, result) => {
        if(error) reject();

        if(result != null)
        {
          if(result.chatIds.includes(chatId)) reject()
          
          col.findOneAndUpdate({'userId': userId}, {$push: {'chatIds': chatId}}, (error, result) => {
            client.close()

            if(error) reject();

            resolve()
          });
        }
        else
        {
          col.insertOne({'userId': userId, 'chatIds': [chatId], 'privateChatId': 0}, (error, result) => {
            client.close();

            if(error) reject();

            resolve();
          });
        }        
      });    
    });
  });
}

exports.getPrivateChatId = userId => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');

      if(err)
      {
        reject()
      }

      db.collection('users').findOne({"userId": userId}, (error, result) => {
        if(error)
        {
          reject();
        }
  
        client.close();
        
        if(result == null)
        {
          reject();
        }
        else
        {
          resolve(result.privateChatId);
        }
      });
    });
  });
};

exports.hasStarted = userId => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');

      if(err)
      {
        reject()
      }

      db.collection('users').findOne({"userId": userId}, (error, result) => {
        if(error)
        {
          reject();
        }
  
        client.close();        
        resolve(result != undefined && result.privateChatId != 0);
      });
    });
  });
};

exports.getGroupIds = userId => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');

      if(err)
      {
        reject()
      }

      db.collection('users').findOne({"userId": userId}, (error, result) => {
        if(error)
        {
          reject();
        }
  
        client.close();
        
        if(result == null)
        {
          reject();
        }
        else
        {
          resolve(result.chatIds);
        }
      });
    });
  });
}

//#region Comentarios
// exports.insertMessage = (msg) => {
//   mongo.connect(url, (err, client) => {
//     const db = client.db('telegram');
//     if(err) throw err;
//     db.collection('messages').insertOne(msg, (error, result) => {
//       if(error) throw err;

//       client.close();
//     });
//   });
// };
//#endregion