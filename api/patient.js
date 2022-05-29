const patientService = require("../application/patientService");
const { doctor } = require("../middleware/inRole");

module.exports = function (app) {
  app.get("/api/patient", async (req, res) => {
    res.send(await patientService.get());
  });

  app.get("/api/patient/:id", doctor, async (req, res) => {
    const { id } = req.params;

    res.send(await patientService.getById(id));
  });

  app.post("/api/patient", doctor, async (req, res) => {
    const patient = req.body;

    await patientService.create(patient);
    res.status(200).send();
  });

  app.delete("/api/patient", doctor, async (req, res) => {
    const { id } = req.query;

    res.send(await patientService.delete(id));
  });
};
