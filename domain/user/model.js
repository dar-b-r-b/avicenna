class User {
  constructor(body = {}) {
    this.id = body.id;
    this.last_name = body.last_name;
    this.name = body.name;
    this.middle_name = body.middle_name;
    this.login = body.login?.toLowerCase();
    this.password = body.password;
    this.role_id = body.role_id;
  }
}

module.exports = User;
