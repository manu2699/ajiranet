let graph = {
  A1: {
    "type": "COMPUTER",
    "name": "A1",
    "strength": 5,
    "connections": ["A2", "A3",]
  },
  A2: {
    "type": "COMPUTER",
    "name": "A2",
    "strength": 5,
    "connections": ["A4"]
  },
  A3: {
    "type": "COMPUTER",
    "name": "A3",
    "strength": 5,
    "connections": ["A4"]
  },
  A4: { "type": "COMPUTER", "name": "A4", "strength": 5, "connections": [] }
}

let add = (data) => {
  graph[data.name] = { ...data, strength: 5, connections: [] }
}

let fetch = () => {
  return { devices: [...Object.values(graph)] }
}

let connecions = (data) => {
  graph[data.source].connections = [...data.targets]
}

let strength = (data) => {
  graph[data.device].strength = data.value
}

let bfs = (src, dest, queue, visited, pred) => {

  //base case.
  if (queue.length === 0)
    return { isPathAvailable: false, pred }

  let curr = queue.shift(); //Dequeue
  if (graph[curr].connections.length >= 1) {

    for (let neighbour of graph[curr].connections) {
      if (!visited.has(neighbour)) {
        visited.add(curr);
        pred[neighbour] = curr;
        queue.push(neighbour);
        if (neighbour === dest) {
          return { isPathAvailable: true, pred }
        }
      }
    }
  }
  return bfs(src, dest, queue, visited, pred)
}

let bfsUtil = (src, dest) => {

  let visited = new Set()
  let queue = []

  //Using predecessor to find the path
  let pred = {}
  for (let key of Object.keys(graph))
    pred[key] = -1;

  queue.push(src);
  visited.add(src);
  return bfs(src, dest, queue, visited, pred)
}

let path = (data) => {
  console.log(data)
  return bfsUtil(data[0], data[1])
}

let getPath = (data, pred) => {
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

  return pathString;
}

let get = () => {
  return graph
}

module.exports = {
  add, fetch, connecions, strength, path, get, getPath,
}