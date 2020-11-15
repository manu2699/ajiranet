const express = require("express");
const https = require("https");
const fs = require("fs");
let Graph = require("./graph");

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/ajiranet/process", (req, res) => {
  let body = Object.keys(req.body);
  let strBody = body[0];
  let command = strBody.split(" ")[0];
  let subPath = strBody.split(" ")[1];
  let respMsg = "", content = {}, respStatus = 0;

  switch (command) {

    case "CREATE":
      switch (subPath) {
        case "/devices":
          try {
            content = JSON.parse(strBody.substring(strBody.search("{")))
            let { status, msg } = Graph.addDevice(content)
            respStatus = status;
            respMsg = { msg };
          } catch (e) {
            respStatus = 400;
            respMsg = { msg: "Invalid Command." }
          }
          break;
        case "/connections":
          try {
            content = JSON.parse(strBody.substring(strBody.search("{")) + "[]}")
            let targetString = Object.keys(Object.values(req.body)[0]);
            content.targets = targetString[0].split("\"").filter(target => target.search(",") === -1 && target.length > 0)
            let { status, msg } = Graph.addConnections(content);
            respStatus = status
            respMsg = { msg }
          } catch (e) {
            respStatus = 400;
            respMsg = { msg: "Invalid Command Syntax." }
          }
          break;
        default:
          respStatus = 400
          respMsg = { msg: "Route not Found" }
      }
      break;

    case "FETCH":
      switch (subPath) {
        case "/devices":
          let resp = Graph.fetchDevices()
          respStatus = 200
          respMsg = { ...resp }
          break;
        case "/info-routes?from":
          let routes = Object.values(req.body)
          if (routes.length < 2) {
            respStatus = 400
            respMsg = { msg: "Invalid Request" }
          }
          let { msg, status } = Graph.findPath(routes)
          respStatus = status
          respMsg = { msg }
          break;
        default:
          respStatus = 400
          respMsg = { msg: "Route not Found" }
      }
      break;

    case "MODIFY":
      content = JSON.parse(strBody.substring(strBody.search("{")))
      content.device = subPath.split("/")[2]
      let { msg, status } = Graph.modifyStrength(content);
      respStatus = status
      respMsg = { msg }
      break;
    default:
      respStatus = 400
      respMsg = { msg: "Route not Found" }
  }
  res.status(respStatus).json({ ...respMsg });
});

const port = 8080;

// https.createServer({
//   key: fs.readFileSync('./httpsServer/server.key'),
//   cert: fs.readFileSync('./httpsServer/server.cert')
// }, app)
//   .listen(port, () => console.log(`AjiraNet listening on port ${port}! Go to https://localhost:${port}/`))

app.listen(port, () => console.log(`AjiraNet listening on port ${port}! Go to https://localhost:${port}/`))