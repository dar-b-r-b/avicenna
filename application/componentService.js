const componentRepository = require("../domain/component/repository");
const contraindicationsRepository = require("../domain/contraindications/repository");

module.exports = {
  validate(component) {
    let errors = [];

    if (!component.name) errors.push("Название");

    if (errors.length) {
      throw new Error(
        `Не удалось сохранить форму. Не заполнены следующие поля: ${errors.join(
          ", "
        )}`
      );
    }
  },
  async get() {
    const components = await componentRepository.get();

    return components;
  },
  async getById(id) {
    const component = await componentRepository.getById(id);

    const contraindications = await contraindicationsRepository.get({
      id_component: id,
    });

    component.allergies = [];
    component.diseases = [];
    component.specialInstructions = [];

    contraindications.forEach((c) => {
      const dto = {
        id: c.id_contraindications,
        is_chronic: c.is_chronic ?? false,
        close_date: c.close_date,
        date_of_diagnosis: c.date_of_diagnosis,
      };

      if (c.type_of_contraindications === 0) {
        component.allergies.push(dto);
      } else if (c.type_of_contraindications === 1) {
        component.diseases.push(dto);
      } else if (c.type_of_contraindications === 2) {
        component.specialInstructions.push(dto);
      }
    });

    return component;
  },
  async create(component) {
    this.validate(component);

    if (component.id) {
      await componentRepository.update(component, component.id);
    } else {
      await componentRepository.create(component);
    }

    await contraindicationsRepository.delete({
      id_component: component.id,
    });

    await Promise.all([
      this.__createContraindications(component, component.allergies, 0),
      this.__createContraindications(component, component.diseases, 1),
      this.__createContraindications(
        component,
        component.specialInstructions,
        2
      ),
    ]);
  },
  delete(id) {
    return componentRepository.delete(id);
  },
  __createContraindications(component, contraindications, type) {
    return Promise.all(
      contraindications?.map((contraindication) =>
        contraindicationsRepository.create({
          id_component: component.id,
          id_contraindications: contraindication.id,
          type_of_contraindications: type,
        })
      )
    );
  },
};
