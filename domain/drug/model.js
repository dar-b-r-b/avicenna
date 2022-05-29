class Drug {
  constructor(body = {}) {
    this.id = body.id;
    this.trade_name = body.trade_name;
    this.id_pharmacological_group = body.id_pharmacological_group;
    this.id_dosage_form = body.id_dosage_form;
    this.is_recipe = body.is_recipe;
    this.mnn = body.mnn;
  }
}

module.exports = Drug;
