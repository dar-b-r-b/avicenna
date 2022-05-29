const specialInstructionsService = require("../application/specialInstructionsService");

module.exports = function (app) {
  app.get("/api/special_instructions", async (req, res) => {
    res.send(await specialInstructionsService.get());
  });
};
