const { WebSocketServer, WebSocket } = require('ws')
const { Project } = require('./database/schemas');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = function startWebSocketServer(s) {
  // Handle websocket errors
  function onSocketPreError(e) {
    console.log(e)
  }
  function onSocketPostError(e) {
    console.log(e)
  }


  // Stand up websocket server
  const clients = {};
  const wss = new WebSocketServer({ noServer: true });

  s.on('upgrade', (req, socket, head) => {
    console.log("client requested upgrade")
    //get the token from the request url
    const url = req.url;
    console.log(url)
    const token = url.split('/')[1];
    console.log(token)
    socket.on('error', onSocketPreError);
    // Add the token to the request object
    req.token = token;

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req, token);
      socket.on('error', onSocketPostError);
    })
  })


  wss.on('close', (ws, req) => {
  })


  wss.on('connection', (ws, req) => {
    ws.token = req.token;
    ws.on('error', onSocketPostError);
    ws.token = req.token;
    ws.on('message', (message) => {


    })

    ws.on('close', (ws, req) => {
      console.log("client disconnected");
      console.log(ws.token);
    })

    // set an interval every 2 seconds and console.log ws.token
    

  })



  // Watch for changes to the database

  Project.watch().on('change', async (d) => {
    console.log("Doc changed")
    const operationType = d.operationType;
    //find the document in the database
    const documentId = d.documentKey._id;
    const data = await Project.findById(documentId).populate('users').populate('adminUsers')
    // loop through all users in the project and send them a message.
    data.users.forEach(user => {
      // loop through all wss clients and for each one that has a token that matches the users id send them a message containing the document
      wss.clients.forEach(client => {
        console.log(client.token, user._id.toString())
        if (client.token === user._id.toString()) {
          client.send(JSON.stringify({ operationType, data}))
        }
      })
    })
  })

}

