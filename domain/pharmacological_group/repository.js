const repositoryConstructor = require("../../infrastructure/persistence");
const Model = require("./model");

const repository = new repositoryConstructor(
  new Model(),
  "pharmacological_group"
);

module.exports = repository;
