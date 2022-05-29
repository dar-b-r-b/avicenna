class Contraindications {
  constructor(body = {}) {
    this.id_component = body.id_component;
    this.id_contraindications = body.id_contraindications;
    this.type_of_contraindications = body.type_of_contraindications;
  }
}

module.exports = Contraindications;
