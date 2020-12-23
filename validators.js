exports.addValidator = (data) => {
  if (data.type !== "COMPUTER" && data.type !== "REPEATER")
    return { status: 400, msg: `Type ${data.type} is not supported`, isValid: false }
  return { isValid: true }
}

exports.addConnectionValidator = (data, graph) => {
  if (!graph[data.source])
    return { status: 400, msg: `Node ${data.source} is not found`, isValid: false }
  return { isValid: true }
}

exports.strengthValidator = (data, graph) => {
  if (!Number.isInteger(data.value))
    return { status: 400, msg: `Value should be an integer`, isValid: false }
  if (!graph[data.device])
    return { status: 400, msg: `Device ${data.device} is not found`, isValid: false }
  return { isValid: true }
}

exports.pathvalidator = (data, graph) => {
  if (!graph[data[0]])
    return { status: 400, msg: `Device ${data[0]} is not found.`, isValid: false }
  if (!graph[data[1]])
    return { status: 400, msg: `Device ${data[1]} is not found.`, isValid: false }
  if (graph[data[0]].type === "REPEATER" || graph[data[1]].type === "REPEATER")
    return { status: 400, msg: `Route cannot be found with Repeater.`, isValid: false }
  if (data[0] === data[1])
    return { status: 200, msg: `Route is ${data[0]} -> ${data[1]}`, isValid: false }
  return { isValid: true }
};