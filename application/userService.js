const userRepository = require("../domain/user/repository");

module.exports = {
  async isUserExists(login) {
    const currentUser = await userRepository.get({ login });
    return currentUser.length;
  },
  create(user) {
    return userRepository.create(user);
  },
  async get(login) {
    const users = await userRepository.get({ login });
    return users[0];
  },
  async getById(id) {
    const user = await userRepository.getById(id);

    if (user) {
      delete user.password;
    }

    return user;
  },
};
