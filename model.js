let Validator = require('jsonschema').Validator;
let v = new Validator();

let GraphSchema = {
  "id": "/GraphModel",
  "type": "object",
  "properties": {
    "type": { "type": "string" }, // Can also be enum of ["COMPUTER", "REPEATER"]
    "name": { "type": "string" },
    "strength": { "type": "integer" },
    "connections": { "type": "array" }
  }
};

v.addSchema(GraphSchema, '/GraphModel');