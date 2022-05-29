const drugService = require("../application/drugService");
const { pharmacist } = require("../middleware/inRole");

module.exports = function (app) {
  app.get("/api/drug", async (req, res) => {
    res.send(await drugService.get());
  });

  app.get("/api/drug/:id", pharmacist, async (req, res) => {
    const { id } = req.params;

    res.send(await drugService.getById(id));
  });

  app.post("/api/drug", pharmacist, async (req, res) => {
    const drug = req.body;

    await drugService.create(drug);
    res.status(200).send();
  });

  app.delete("/api/drug", pharmacist, async (req, res) => {
    const { id } = req.query;

    res.send(await drugService.delete(id));
  });
};
