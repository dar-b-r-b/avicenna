const repositoryConstructor = require("../../infrastructure/persistence");
const Model = require("./model");

const repository = new repositoryConstructor(
  new Model(),
  "contraindications",
  false
);

module.exports = repository;
