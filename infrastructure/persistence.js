const { pool } = require("../config/database");

class repositoryConstructor {
  constructor(model, modelName, hasId = true) {
    this.fields = Object.keys(model).filter((x) => x !== "id");
    this.modelName = modelName;
    this.hasId = hasId;
  }

  async get(byFields = {}) {
    let where = "";
    let values = [];
    const fields = Object.keys(byFields);

    if (fields.length) {
      where =
        "WHERE " + fields.map((field, index) => `${field} = $${index + 1}`);

      values = fields.map((f) => byFields[f]);
    }

    return (
      await pool.query(`SELECT * FROM ${this.modelName} ${where}`, values)
    ).rows;
  }

  async getById(id) {
    return (
      await pool.query(`SELECT * FROM ${this.modelName} WHERE id = $1`, [id])
    ).rows[0];
  }

  async create(data) {
    let query = `INSERT INTO ${this.modelName} (${this.fields.join(
      ","
    )}) VALUES (${this.fields.map((_, index) => "$" + (index + 1)).join(",")})`;

    if (this.hasId) {
      query += " RETURNING id";
    }

    const result = await pool.query(
      query,
      this.fields.map((f) => data[f])
    );

    if (this.hasId) {
      data.id = result.rows[0].id;
    }
  }

  update(data, searchBy) {
    const fields = this.fields.filter((x) => x !== "password");

    const query = `UPDATE ${this.modelName} SET ${fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(",")}`;

    const values = fields.map((field) => data[field]);

    return this.__executeChange(searchBy, query, values);
  }

  delete(searchBy = {}) {
    const query = `DELETE FROM ${this.modelName}`;

    return this.__executeChange(searchBy, query, []);
  }

  async __executeChange(searchBy, query, values) {
    const parameterIndexOffset = values.length;

    if (this.hasId) {
      query += " WHERE id = $" + (parameterIndexOffset + 1);
      values.push(searchBy);
    } else {
      const searchFields = Object.keys(searchBy);

      if (searchFields.length) {
        query +=
          " WHERE " +
          searchFields
            .map(
              (field, index) =>
                `${field} = $${index + parameterIndexOffset + 1}`
            )
            .join(" AND ");

        values = values.concat(searchFields.map((f) => searchBy[f]));
      }
    }

    await pool.query(query, values);
  }
}

module.exports = repositoryConstructor;
