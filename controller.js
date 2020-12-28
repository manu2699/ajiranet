let Validators = require("./validators");
let Graph = require("./graph");

let addDevice = (data) => {
  let { status, msg, isValid } = Validators.addValidator(data, Graph.get())
  if (!isValid)
    return { status, msg }

  Graph.add(data)
  return { status: 200, msg: `Device added` }
}

let addRedirect = (data) => {
  let { status, msg, isValid } = Validators.addRedirectionValidator(data, Graph.get())
  if (!isValid)
    return { status, msg }

  Graph.redirect(data)
  return { status: 200, msg: `Redirection added` }
}

let fetchDevices = () => {
  return { ...Graph.fetch() }
}

let addConnections = (data) => {
  let { status, msg, isValid } = Validators.addConnectionValidator(data, Graph.get())
  if (!isValid)
    return { status, msg }

  Graph.connections(data);
  return { status: 200, msg: `Connected Successfully` }
}

let addBlackLists = (data) => {
  let { status, msg, isValid } = Validators.addConnectionValidator(data, Graph.get())
  if (!isValid)
    return { status, msg }

  Graph.blacklists(data);
  return { status: 200, msg: `Added Blacklists Successfully` }
}

let modifyStrength = (data) => {
  let { status, msg, isValid } = Validators.strengthValidator(data, Graph.get())
  if (!isValid)
    return { status, msg }

  Graph.strength(data);
  return { status: 200, msg: `Successfully defined Strength` }
}

let findPath = (data) => {
  let { status, msg, isValid } = Validators.pathvalidator(data, Graph.get())
  if (!isValid)
    return { status, msg }

  let { pred, isPathAvailable } = Graph.path(data)
  if (!isPathAvailable)
    return { status: 200, msg: "No route found" }

  let { pathString, canTraverse } = Graph.getPath(data, pred)
  if (!canTraverse)
    return { status: 200, msg: "Couldn't Reach destination" }

  return { status: 200, msg: `Route is ${pathString}` }
};

module.exports = {
  addDevice, fetchDevices, addConnections, modifyStrength, findPath, addRedirect, addBlackLists
}