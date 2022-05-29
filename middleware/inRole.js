const { adminRole, doctorRole, pharmacistRole } = require("../config/roles");

function inRole(req, res, next, roles) {
  const userRole = req.user?.role_id;

  roles.push(adminRole);
  const allowed = roles.includes(userRole);

  if (!allowed) {
    return res.status(403).send("Раздел недоступен");
  }

  return next();
}

module.exports = {
  doctor(req, res, next) {
    return inRole(req, res, next, [doctorRole]);
  },
  pharmacist(req, res, next) {
    return inRole(req, res, next, [pharmacistRole]);
  },
};
