const componentService = require("../application/componentService");
const { pharmacist } = require("../middleware/inRole");

module.exports = function (app) {
  app.get("/api/component", pharmacist, async (req, res) => {
    res.send(await componentService.get());
  });

  app.get("/api/component/:id", pharmacist, async (req, res) => {
    const { id } = req.params;

    res.send(await componentService.getById(id));
  });

  app.post("/api/component", pharmacist, async (req, res) => {
    const component = req.body;

    await componentService.create(component);
    res.status(200).send();
  });

  app.delete("/api/component", pharmacist, async (req, res) => {
    const { id } = req.query;

    res.send(await componentService.delete(id));
  });
};
