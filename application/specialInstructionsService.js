const specialInstructionsRepository = require("../domain/special_instructions/repository");

module.exports = {
  async get() {
    const specialInstructions = await specialInstructionsRepository.get();

    return specialInstructions;
  },
};
