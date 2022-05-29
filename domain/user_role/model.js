class UserRole {
  constructor(body = {}) {
    this.id = body.id;
    this.role = body.role;
  }
}

module.exports = UserRole;
