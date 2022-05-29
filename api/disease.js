const diseaseService = require("../application/diseaseService");

module.exports = function (app) {
  app.get("/api/disease", async (req, res) => {
    res.send(await diseaseService.get());
  });
};
