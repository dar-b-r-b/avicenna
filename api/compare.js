const compareService = require("../application/compareService");

module.exports = function (app) {
  app.get("/api/compare", async (req, res) => {
    const { patientId, drugId } = req.query;
    res.send(await compareService.compare(+patientId, +drugId));
  });

  app.get("/api/analog", async (req, res) => {
    const { drugId } = req.query;

    res.send(await compareService.analog(+drugId));
  });
};
