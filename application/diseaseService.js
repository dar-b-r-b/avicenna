const diseaseRepository = require("../domain/disease/repository");

module.exports = {
  async get() {
    const diseases = await diseaseRepository.get();

    return diseases;
  },
};
