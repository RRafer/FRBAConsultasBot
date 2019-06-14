const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//Estructura:
//userId - number
//chatIds - array de number

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
          if(result.chatIds.includes(chatId)) resolve();
          
          col.findOneAndUpdate({'userId': userId}, {$push: {'chatIds': chatId}}, (findErr, result) => {
            client.close()

            if(findErr) reject();

            resolve();
          });
        }
        else
        {
          col.insertOne({'userId': userId, 'chatIds': [chatId]}, (error, result) => {
            client.close();

            if(error) reject();

            resolve();
          });
        }        
      });    
    });  
  });
}

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

// exports.hasStarted = userId => {
//   return new Promise((resolve, reject) => {
//     mongo.connect(url, (err, client) => {
//       const db = client.db('telegram');

//       if(err)
//       {
//         reject()
//       }

//       db.collection('users').findOne({"userId": userId}, (error, result) => {
//         if(error)
//         {
//           reject();
//         }
  
//         client.close();        
//         resolve(result != undefined && result.privateChatId != 0);
//       });
//     });
//   });
// };

// exports.setStartedUser = userId => {  
//   return new Promise((resolve, reject) => {
//     mongo.connect(url, (err, client) => {
//       const db = client.db('telegram');
//       const col = db.collection('users');
  
//       if(err) reject();
  
//       col.find({'userId': userId}).count((error, result) => {
//         if(error) reject();
  
//         if(result == 1)
//         {
//           col.findOneAndUpdate({'userId': userId}, {$set: {'hasStarted': true}}, (findError, result) => {            
//             client.close();
  
//             if(findError) reject();
  
//             resolve();
//           });
//         }
//         else if(result == 0)
//         {
//           col.insertOne({'userId': userId, 'chatIds': [], 'hasStarted': true}, (insertError, result) => {            
//             client.close();
  
//             if(insertError) reject();
  
//             resolve();
//           });
//         }        
//       });    
//     });
//   });    
// }

// exports.getPrivateChatId = userId => {
//   return new Promise((resolve, reject) => {
//     mongo.connect(url, (err, client) => {
//       const db = client.db('telegram');

//       if(err)
//       {
//         reject()
//       }

//       db.collection('users').findOne({"userId": userId}, (error, result) => {
//         if(error)
//         {
//           reject();
//         }
  
//         client.close();
        
//         if(result == null)
//         {
//           reject();
//         }
//         else
//         {
//           resolve(result.privateChatId);
//         }
//       });
//     });
//   });
// };

//#endregion