const pharmacologicalGroupService = require("../application/pharmacologicalGroupService");

module.exports = function (app) {
  app.get("/api/pharmacological_group", async (req, res) => {
    res.send(await pharmacologicalGroupService.get());
  });
};
