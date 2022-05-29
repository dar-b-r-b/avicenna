const allergyService = require("../application/allergyService");

module.exports = function (app) {
  app.get("/api/allergy", async (req, res) => {
    res.send(await allergyService.get());
  });
};
