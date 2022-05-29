const pharmacologicalGroupRepository = require("../domain/pharmacological_group/repository");

module.exports = {
  async get() {
    const pharmacologicalGroups = await pharmacologicalGroupRepository.get();

    return pharmacologicalGroups;
  },
};
