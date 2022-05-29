const drugRepository = require("../domain/drug/repository");
const compositionRepository = require("../domain/composition/repository");

module.exports = {
  validate(drug) {
    let errors = [];

    if (!drug.trade_name) errors.push("Название");
    if (!drug.mnn) errors.push("МНН");
    if (!drug.id_pharmacological_group) errors.push("Фармакологическая группа");
    if (!drug.id_dosage_form) errors.push("Форма выпуска");

    if (drug.drugComponents?.length) {
      const componentsWithoutDosage = drug.drugComponents.filter(
        (c) => !c.dosage
      );
      if (componentsWithoutDosage.length) {
        errors = errors.concat(
          componentsWithoutDosage.map((c) => `Компонент ${c.name}: дозировка`)
        );
      }
    }

    if (errors.length) {
      throw new Error(
        `Не удалось сохранить форму. Не заполнены следующие поля: ${errors.join(
          ", "
        )}`
      );
    }
  },
  async get() {
    const drugs = await drugRepository.get();

    return drugs;
  },
  async getById(id) {
    const drug = await drugRepository.getById(id);

    const compositions = await compositionRepository.get({
      id_drug: id,
    });

    drug.drugComponents = compositions.map((c) => ({
      id: c.id_component,
      dosage: c.dosage,
      is_active: c.is_active,
    }));

    return drug;
  },
  async create(drug) {
    this.validate(drug);

    if (drug.id) {
      await drugRepository.update(drug, drug.id);
    } else {
      await drugRepository.create(drug);
    }

    await compositionRepository.delete({
      id_drug: drug.id,
    });

    drug.drugComponents?.forEach(
      async (component) =>
        await compositionRepository.create({
          id_drug: drug.id,
          id_component: component.id,
          dosage: component.dosage,
          is_active: component.is_active,
        })
    );
  },
  delete(id) {
    return drugRepository.delete(id);
  },
};
