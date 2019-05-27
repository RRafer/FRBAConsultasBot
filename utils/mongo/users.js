const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//Estructura:
//userId - number
//chatIds - array de number
//privateChatId - number

exports.insertPrivateChat = (userId, privateChatId) => {  
  mongo.connect(url, (err, client) => {
    const db = client.db('telegram');
    const col = db.collection('users');

    if(err) throw err;

    col.find({'userId': userId}).count((error, result) => {
      if(error) throw error;

      if(result > 0)
      {
        col.findOneAndUpdate({'userId': userId}, {$set: {'privateChatId': privateChatId}}, (findError, result) => {            
          client.close()

          if(findError) throw findError;

          return;
        });
      }
      else
      {
        col.insertOne({'userId': userId, 'chatIds': [], 'privateChatId': privateChatId}, (insertError, result) => {            
          client.close();

          if(insertError) throw insertError;

          return;
        });
      }        
    });    
  });
}

exports.insertChatId = (userId, chatId) => {  
  mongo.connect(url, (err, client) => {
    const db = client.db('telegram');
    const col = db.collection('users');

    if(err) throw err;
    
    col.findOne({'userId': userId}, (error, result) => {
      if(error) throw error;

      if(result != null)
      {
        if(result.chatIds.includes(chatId)) return;
        
        col.findOneAndUpdate({'userId': userId}, {$push: {'chatIds': chatId}}, (findErr, result) => {
          client.close()

          if(findErr) throw findErr;

          return;
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