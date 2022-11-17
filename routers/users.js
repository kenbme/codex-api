const router = require("express").Router();
const verifyToken = require("../jwt");
const { body, validationResult } = require("express-validator");
const usersService = require("../services/users");

const requiredBirthdate = () => {
  const date = new Date(Date.now());
  date.setFullYear(date.getFullYear() - 18);
  return date.toString();
};

router.post(
  "/signup",
  [
    body("username").isAlphanumeric().isLength({ min: 6 }),
    body("fullname").isAlpha("pt-BR", { ignore: " " }),
    body("email").normalizeEmail().isEmail(),
    body("gender")
      .isAlpha()
      .custom((gender) => {
        return gender == "Male" || gender == "Female" || gender == "Other";
      }),
    body("birthdate")
      .isISO8601({ strict: "YYYY-MM-DD" })
      .toDate()
      .isBefore(requiredBirthdate()),
    body("password").isStrongPassword().escape(),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const user = await usersService.signUp(
        request.body.username,
        request.body.fullname,
        request.body.email,
        request.body.gender,
        request.body.birthdate,
        request.body.password
      );
      if (user) {
        response.status(200).send("User has been created.");
      } else {
        response.status(409).send("Username/Email already registered.");
      }
    } else {
      response.status(400).send(errors);
    }
  }
);

router.post(
  "/signin",
  [
    body("username").isAlphanumeric().isLength({ min: 6 }),
    body("password").isStrongPassword().escape(),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const token = await usersService.signIn(
        request.body.username,
        request.body.password
      );
      if (token) {
        response.status(200).json({ token: token });
      } else {
        response.status(403).send("Wrong username/password.");
      }
    } else {
      response.status(400).json(errors);
    }
  }
);

router.post("/signout", async (request, response) => {
  const token = await usersService.signOut();
  response.status(200).json({ token: token });
});

router.get("/users/:username", verifyToken, async (request, response) => {
  const user = await usersService.getUser(request.username);
  response.status(200).json(user);
});

router.delete("/users/:username", verifyToken, async (request, response) => {
  const user = await usersService.deleteUser(request.username);
  response.status(200).send("User has been deleted.");
});

router.put(
  "/users/:username",
  verifyToken,
  [
    body("fullname").isAlpha("pt-BR", { ignore: " " }),
    body("email").normalizeEmail().isEmail(),
    body("gender")
      .isAlpha()
      .custom((gender) => {
        return gender == "Male" || gender == "Female" || gender == "Other";
      }),
    body("birthdate")
      .isISO8601({ strict: "YYYY-MM-DD" })
      .toDate()
      .isBefore(requiredBirthdate()),
    body("password").isStrongPassword().escape(),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const user = await usersService.editUser(
        request.username,
        request.body.fullname,
        request.body.email,
        request.body.gender,
        request.body.birthdate,
        request.body.password
      );
      if (user) {
        response.status(200).send("User has been updated.");
      } else {
        response.status(409).send("Email already in use");
      }
    } else {
      response.status(400).json(errors);
    }
  }
);

module.exports = router;
