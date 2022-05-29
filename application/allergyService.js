const allergyRepository = require("../domain/allergy/repository");

module.exports = {
  async get() {
    const allergies = await allergyRepository.get();

    return allergies;
  },
};
