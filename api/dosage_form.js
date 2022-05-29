const dosageFormService = require("../application/dosageFormService");

module.exports = function (app) {
  app.get("/api/dosage_form", async (req, res) => {
    res.send(await dosageFormService.get());
  });
};
