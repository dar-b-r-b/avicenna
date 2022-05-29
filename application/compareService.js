const { pool } = require("../config/database");
const drugService = require("../application/drugService");

module.exports = {
  async compare(patientId, drugId) {
    if (!patientId || !drugId)
      throw new Error("Все поля обязательны для заполнения");

    const patientContraindications = (
      await pool.query(
        `
select 
	cp.type_of_contraindication as "type",
	(case when cp.type_of_contraindication = 0 then a.id when  cp.type_of_contraindication = 1 then d.id else si.id end) as contraindication_id
from patient p 
join contraindications_patient cp on cp.id_patient  = p.id 
left join allergy a on a.id = cp.id_contraindications and cp.type_of_contraindication = 0
left join disease d on d.id = cp.id_contraindications and cp.type_of_contraindication = 1
left join special_instructions si on si.id = cp.id_contraindications and cp.type_of_contraindication = 2
where p.id = $1 and (close_date is null or current_date - close_date < 14)`,
        [patientId]
      )
    ).rows;

    const drugContraindications = (
      await pool.query(
        `select 
	drug.trade_name, c."name", cp.type_of_contraindications as "type",
	(case when cp.type_of_contraindications = 0 then a.id when  cp.type_of_contraindications = 1 then d.id else si.id end) as contraindication_id,
	(case when cp.type_of_contraindications = 0 then a."name"  when  cp.type_of_contraindications = 1 then d."name"  else si."name" end) as contraindication_name
from drug
join composition on composition.id_drug = drug.id 
join component c on c.id = composition.id_component 
join contraindications cp on cp.id_component  = c.id 
left join allergy a on a.id = cp.id_contraindications and cp.type_of_contraindications = 0
left join disease d on d.id = cp.id_contraindications and cp.type_of_contraindications = 1
left join special_instructions si on si.id = cp.id_contraindications and cp.type_of_contraindications = 2
where drug.id = $1`,
        [drugId]
      )
    ).rows;

    const allergies = [];
    const diseases = [];
    const specialInstructions = [];

    for (let i = 0; i < patientContraindications.length; i++) {
      const patientContraindication = patientContraindications[i];
      const drugContraindication = drugContraindications.find(
        (d) =>
          d.type === patientContraindication.type &&
          d.contraindication_id === patientContraindication.contraindication_id
      );

      if (drugContraindication) {
        if (drugContraindication.type === 0) {
          allergies.push(drugContraindication);
        } else if (drugContraindication.type === 1) {
          diseases.push(drugContraindication);
        } else {
          specialInstructions.push(drugContraindication);
        }
      }
    }

    return { allergies, diseases, specialInstructions };
  },
  async analog(drugId) {
    const drug = await drugService.getById(drugId);

    const sql = `SELECT
    d.id, d.trade_name
FROM
    drug d
INNER JOIN composition on composition.id_drug = d.id 
INNER JOIN component c on c.id = composition.id_component 
where composition.is_active = true and d.id_dosage_form = $1 and d.id != $2
GROUP BY
    d.id
having ARRAY_AGG (c.id order by c.id) = ($3)`;

    return (
      await pool.query(sql, [
        drug.id_dosage_form,
        drug.id,
        drug.drugComponents
          .filter((c) => c.is_active)
          .map((c) => c.id)
          .sort(),
      ])
    ).rows;
  },
};
