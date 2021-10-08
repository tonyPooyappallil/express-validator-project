const express = require("express");

const { body, validationResult } = require("express-validator");

const router = express.Router();

const Users = require("../models/user.model");

router.post(
  "/",
  body("first_name")
    .isLength({ min: 1 })
    .withMessage("First name is Mandatory"),
  body("email").isLength({ min: 1 }).withMessage("Email id is required"),
  body("email").isEmail().withMessage("Please input a valid email id"),
  body("last_name").isLength({ min: 1 }).withMessage("Last name is Mandatory"),
  body("age").custom((value) => {
    //  console.log(value);
    if (value < 1 || value > 100) {
      //console.log("value");
      throw new Error("age must be between 1 and 100");
    } else return true;
  }),
  body("pincode").custom((value) => {
    //console.log(String(value).length);
    if (Number(value) != value || String(value).length != 6) {
      //console.log("value");
      throw new Error("please enter a valid pincode ");
    } else return true;
  }),
  body("gender").custom((value) => {
    //console.log(String(value).length);
    if (
      value.toLowerCase() == "male" ||
      value.toLowerCase() == "female" ||
      value.toLowerCase() == "others"
    ) {
      //console.log("value");
      return true;
    } else throw new Error("please enter correct gender ");
  }),
  async function (req, res) {
    const errors = validationResult(req);
    //console.log(errors);
    let finalErrors = null;
    if (!errors.isEmpty()) {
      finalErrors = errors.array().map((error) => {
        return {
          param: error.param,
          msg: error.msg,
        };
      });
      return res.status(400).json({ errors: finalErrors });
    }

    const user = await Users.create(req.body);

    return res.status(201).send(user);
  }
);

// router.post("/", async function (req, res) {
//   const user = await Users.create(req.body);

//   return res.status(201).send(user);
// });

module.exports = router;
