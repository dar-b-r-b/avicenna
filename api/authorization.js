const SALT = process.env.SALT;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userService = require("../application/userService");
const UserModel = require("../domain/user/model");

const dayjs = require("dayjs");

module.exports = function (app) {
  app.post("/api/register", async (req, res) => {
    try {
      const user = new UserModel(req.body);

      if (!(user.name && user.login && user.password)) {
        return res
          .status(400)
          .send("Все обязательные поля должны быть заполнены");
      }

      if (await userService.isUserExists(user.login)) {
        return res
          .status(409)
          .send("Пользователь с таким именем уже зарегистрирован");
      }

      const encryptedPassword = await bcrypt.hash(user.password, Number(SALT));
      user.password = encryptedPassword;

      await userService.create(user);

      const token = jwt.sign(
        { user_id: user.id, login: user.login },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      const response = { ...user };
      delete response.password;

      const cookieExpiresIn = dayjs().add(1, "days").toDate();
      res.cookie("access-token", token, {
        secure: true,
        httpOnly: true,
        expires: cookieExpiresIn,
        sameSite: "none",
        domain: "herokuapp.com",
      });
      res.cookie("user", JSON.stringify(response), {
        expires: cookieExpiresIn,
      });

      res.status(201).json(response);
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { login, password } = req.body;

      if (!(login && password)) {
        return res.status(400).send("Все поля обязательны для заполнения");
      }

      const user = await userService.get(login);

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user.id, login, role_id: user.role_id },
          process.env.TOKEN_KEY,
          {
            expiresIn: "24h",
          }
        );

        const response = { ...user };
        delete response.password;

        const cookieExpiresIn = dayjs().add(1, "days").toDate();
        res.cookie("access-token", token, {
          secure: true,
          httpOnly: true,
          expires: cookieExpiresIn,
          domain: "herokuapp.com",
          sameSite: "none",
        });
        res.cookie("user", JSON.stringify(response), {
          expires: cookieExpiresIn,
        });

        return res.status(200).json(response);
      }

      res.status(400).send("Неверные логин или пароль");
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/api/logout", async (req, res) => {
    res.clearCookie("access-token");
    res.clearCookie("user");

    res.end();
  });
};
