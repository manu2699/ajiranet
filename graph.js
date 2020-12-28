let graph = {
  A1: {
    "type": "COMPUTER",
    "name": "A1",
    "strength": 5,
    "connections": ["A2", "A3"],
    "blacklists": []
  },
  A2: {
    "type": "COMPUTER",
    "name": "A2",
    "strength": 5,
    "connections": ["A1"],
    "blacklists": []
  },
  A3: {
    "type": "COMPUTER",
    "name": "A3",
    "strength": 5,
    "connections": ["A1"],
    "blacklists": []
  },
  A4: {
    "type": "COMPUTER",
    "name": "A4",
    "strength": 3,
    "connections": ["A2"],
    "blacklists": []
  }
}

let add = (data) => {
  graph[data.name] = { ...data, strength: 5, connections: [], blacklists: [] }
}

let fetch = () => {
  return { devices: [...Object.values(graph)] }
}

let redirect = (data) => {
  graph[data.from].redirect = data.to;
}

let connections = (data) => {
  graph[data.source].connections = [...graph[data.source].connections, ...data.targets]
  for (let i = 0; i < data.targets.length; i++) {
    graph[data.targets[i]].connections = [...graph[data.targets[i]].connections, data.source]
  }
}

let blacklists = (data) => {
  graph[data.source].blacklists = [...graph[data.source].blacklists, ...data.targets]
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
        if (neighbour === dest) {
          pred[neighbour] = curr;
          return { isPathAvailable: true, pred }
        }
        if (graph[neighbour].blacklists.indexOf(curr) !== -1)
          continue;
        visited.add(curr);
        pred[neighbour] = curr;
        queue.push(neighbour);
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
  let path = [], crawl = data[1], pathString = "", canTraverse = false;
  let { blacklists } = graph[data[0]]

  path.push(crawl)
  while (pred[crawl] !== -1) {
    path.push(pred[crawl])
    crawl = pred[crawl]
  }
  if (path.length > graph[data[0]].strength)
    return { pathString, canTraverse }

  canTraverse = true
  while (path.length > 1)
    pathString += path.pop() + " -> ";
  pathString += path.pop()

  if (graph[data[1]].redirect) {
    if (graph[data[1]].connections.indexOf(graph[data[1]].redirect) !== -1 &&
      blacklists.indexOf(graph[data[1]].redirect) == -1)
      pathString += `, ${data[1]} -> ${graph[data[1]].redirect}`
    else
      canTraverse = false
  }
  return { pathString, canTraverse };
}

let get = () => {
  return graph
}

module.exports = {
  add, fetch, connections, strength, path, get, getPath, redirect, blacklists
}