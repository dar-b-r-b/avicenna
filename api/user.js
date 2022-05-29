const userService = require("../application/userService");

module.exports = function (app) {
  app.get("/api/user", async (req, res) => {
    const { id } = req.query;

    res.send(await userService.getById(id));
  });
};
