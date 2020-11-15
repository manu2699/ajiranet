let graph = {}
let addDevice = (data) => {
  if (data.type !== "COMPUTER" && data.type !== "REPEATER")
    return { status: 400, msg: `Type ${data.type} is not supported` }
  graph[data.name] = { ...data, strength: 5, connections: [] }
  return { status: 200, msg: `Device added` }
}

let fetchDevices = () => {
  return { devices: [...Object.values(graph)] }
}

let addConnections = (data) => {
  if (!graph[data.source])
    return { status: 400, msg: `Node ${data.source} is not found` }
  graph[data.source].connections = [...data.targets]
  return { status: 200, msg: `Connected Successfully` }
}

let modifyStrength = (data) => {
  if (!Number.isInteger(data.value))
    return { status: 400, msg: `Value should be an integer` }
  if (!graph[data.device])
    return { status: 400, msg: `Device ${data.device} is not found` }
  graph[data.device].strength = data.value
  return { status: 200, msg: `Successfully defined Strength` }
}

let bfs = (src, dest) => {
  let keys = Object.keys(graph)
  let visited = new Set(), queue = []
  let pred = {}
  for (let key of keys)
    pred[key] = -1;

  queue.push(src);
  visited.add(src);
  // dist[src] = 0;
  while (queue.length > 0) {
    let curr = queue.shift();
    if (graph[curr].connections.length >= 1) {
      for (let neighbour of graph[curr].connections) {
        if (!visited.has(neighbour)) {
          visited.add(curr);
          // dist[neighbour] = dist[curr] + 1;
          pred[neighbour] = curr;
          queue.push(neighbour);
          if (neighbour === dest) {
            return { isPathAvailable: true, pred }
          }
        }
      }
    }
  }
  return { isPathAvailable: false }
}

let findPath = (data) => {
  if (!graph[data[0]])
    return { status: 400, msg: `Device ${data[0]} is not found.` }
  if (!graph[data[1]])
    return { status: 400, msg: `Device ${data[1]} is not found.` }
  if (graph[data[0]].type === "REPEATER" || graph[data[1]].type === "REPEATER")
    return { status: 400, msg: `Route cannot be found with Repeater.` }
  if (data[0] === data[1])
    return { status: 200, msg: `Route is ${data[0]} -> ${data[1]}` }
  let { pred, isPathAvailable } = bfs(data[0], data[1])
  if (!isPathAvailable)
    return { status: 200, msg: "No route found" }
  let path = [];
  let crawl = data[1];
  path.push(crawl)
  while (pred[crawl] !== -1) {
    path.push(pred[crawl])
    crawl = pred[crawl]
  }
  let pathString = ""
  while (path.length > 1)
    pathString += path.pop() + " -> ";
  pathString += path.pop()
  return { status: 200, msg: `Route is ${pathString}` }
};

module.exports = {
  addDevice, fetchDevices, addConnections, modifyStrength, findPath
}