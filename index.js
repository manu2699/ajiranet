const express = require("express");
// const https = require("https");
// const fs = require("fs");
let GraphController = require("./controller");

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/ajiranet/process", (req, res) => {
  //parsing data with the format
  let body = Object.keys(req.body);
  let strBody = body[0];
  let command = strBody.split(" ")[0]; //command will be the First string in data
  let subPath = strBody.split(" ")[1];

  let respMsg = { msg: "Route Not Found" }, content = {}, respStatus = 400;

  switch (command) {

    case "CREATE":
      switch (subPath) {
        case "/devices":
          try {
            //Searching for the 1st { (curly brace)'s index
            //Then till the end it is a json content thus using JSON.parse
            content = JSON.parse(strBody.substring(strBody.search("{")))
            let { status, msg } = GraphController.addDevice(content)
            respStatus = status;
            respMsg = { msg };
          } catch (e) {
            respStatus = 400;
            respMsg = { msg: "Invalid Command." }
          }
          break;
        case "/connections":
          try {
            //parsing the body
            content = JSON.parse(strBody.substring(strBody.search("{")) + "[]}")
            let targetString = Object.keys(Object.values(req.body)[0]);
            content.targets = targetString[0].split("\"").filter(target => target.search(",") === -1 && target.length > 0)

            let { status, msg } = GraphController.addConnections(content);
            respStatus = status
            respMsg = { msg }
          } catch (e) {
            respStatus = 400;
            respMsg = { msg: "Invalid Command Syntax." }
          }
          break;
        case "/redirect":
          try {
            //Searching for the 1st { (curly brace)'s index
            //Then till the end it is a json content thus using JSON.parse
            content = JSON.parse(strBody.substring(strBody.search("{")))
            let { status, msg } = GraphController.addRedirect(content)
            respStatus = status;
            respMsg = { msg };
          } catch (e) {
            respStatus = 400;
            respMsg = { msg: "Invalid Command." }
          }
          break;
        case "/blacklists":
          try {
            //parsing the body
            content = JSON.parse(strBody.substring(strBody.search("{")) + "[]}")
            let targetString = Object.keys(Object.values(req.body)[0]);
            content.targets = targetString[0].split("\"").filter(target => target.search(",") === -1 && target.length > 0)

            let { status, msg } = GraphController.addBlackLists(content);
            respStatus = status
            respMsg = { msg }
          } catch (e) {
            respStatus = 400;
            respMsg = { msg: "Invalid Command Syntax." }
          }
          break;
      }
      break;

    case "FETCH":
      switch (subPath) {
        case "/devices":
          let resp = GraphController.fetchDevices()
          respStatus = 200
          respMsg = { ...resp }
          break;
        case "/info-routes?from":
          let routes = Object.values(req.body)
          if (routes.length < 2) {
            respStatus = 400
            respMsg = { msg: "Invalid Request" }
          }
          let { msg, status } = GraphController.findPath(routes)
          respStatus = status
          respMsg = { msg }
          break;
      }
      break;

    case "MODIFY":
      content = JSON.parse(strBody.substring(strBody.search("{")))
      content.device = subPath.split("/")[2]
      let { msg, status } = GraphController.modifyStrength(content);
      respStatus = status
      respMsg = { msg }
      break;
  }
  res.status(respStatus).json({ ...respMsg });
});

const port = 8080;

//Couldn't make curl commands with secure enabled :(

// https.createServer({
//   key: fs.readFileSync('./httpsServer/server.key'),
//   cert: fs.readFileSync('./httpsServer/server.cert')
// }, app)
//   .listen(port, () => console.log(`AjiraNet listening on port ${port}! Go to https://localhost:${port}/`))

app.listen(port, () => console.log(`AjiraNet listening on port ${port}! Go to https://localhost:${port}/`))