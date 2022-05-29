const repositoryConstructor = require("../../infrastructure/persistence");
const { pool } = require("../../config/database");

const Model = require("./model");

const repository = new repositoryConstructor(new Model(), "drug");

repository.get = async function () {
  const drugs = await pool.query(`
    SELECT d.*, df."name" AS dosage_form_name, pg.name AS pharmacological_group_name
    FROM drug d 
    JOIN dosage_form df ON df.id = d.id_dosage_form 
    JOIN pharmacological_group pg ON pg.id = d.id_pharmacological_group`);

  return drugs.rows;
};

module.exports = repository;
