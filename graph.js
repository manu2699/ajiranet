let firstPath = 0;
let graph = {
  A1: {
    "type": "COMPUTER",
    "name": "A1",
    "strength": 5,
    "connections": ["A2", "A4"]
  },
  A2: {
    "type": "COMPUTER",
    "name": "A2",
    "strength": 5,
    "connections": ["A3"]
  },
  A3: { "type": "COMPUTER", "name": "A3", "strength": 5, "connections": [] },
  A4: { "type": "COMPUTER", "name": "A4", "strength": 5, "connections": [] }
}

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

let dfs = (visited, src, dest, path) => {
  path.push(src)
  graph[src].strength -= 1
  if (src === dest && firstPath === 0) {
    console.log(path)
    firstPath = 1;
    return path
  }
  visited.add(src);
  if (graph[src].connections.length >= 1) {
    for (let neighbour of graph[src].connections) {
      if (!visited.has(neighbour) && graph[neighbour].strength > 0) {
        dfs(visited, neighbour, dest, path);
      }
    }
  }
  return path
}

let findPath = (data) => {
  firstPath = 0;
  if (!graph[data[0]])
    return { status: 400, msg: `Device ${data[0]} is not found.` }
  if (!graph[data[1]])
    return { status: 400, msg: `Device ${data[1]} is not found.` }
  if (graph[data[0]].type === "REPEATER" || graph[data[1]].type === "REPEATER")
    return { status: 400, msg: `Route cannot be found with Repeater.` }
  let path = dfs(new Set(), data[0], data[1], [])
  console.log("s", path)
  return { status: 200, msg: "path" }
};

module.exports = {
  addDevice, fetchDevices, addConnections, modifyStrength, findPath
}