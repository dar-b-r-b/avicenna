const dosageFormRepository = require("../domain/dosage_form/repository");

module.exports = {
  async get() {
    const dosageForms = await dosageFormRepository.get();

    return dosageForms;
  },
};
