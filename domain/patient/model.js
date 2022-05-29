class Patient {
  constructor(body = {}) {
    this.id = body.id;
    this.last_name = body.last_name;
    this.name = body.name;
    this.middle_name = body.middle_name;
    this.date_of_birth = body.date_of_birth;
    this.sex = body.sex;
    this.snils = body.snils;
    this.created_by = body.created_by;
  }
}

module.exports = Patient;
