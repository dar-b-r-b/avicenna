const repositoryConstructor = require("../../infrastructure/persistence");
const Model = require("./model");

const repository = new repositoryConstructor(
  new Model(),
  "special_instructions"
);

module.exports = repository;
