class Composition {
  constructor(body = {}) {
    this.id_drug = body.id_drug;
    this.id_component = body.id_component;
    this.dosage = body.dosage;
    this.is_active = body.is_active;
  }
}

module.exports = Composition;
