const router = require("express").Router();
const mongodb = require("mongodb");
const User = require("../models/User");
const Note = require("../models/Note");
const cors = require("cors");
const passport = require("passport");

/*
 *   -----------------------------------
 *        GET Requests
 *   ...................................
 */
router.get("/", cors(), (req, res) => {
  res.json(null);
});

router.get("/api/notes", cors(), async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});
// router.get("/:user", (req, res, next) => {});

/*
 *   -----------------------------------
 *        POST Requests
 *   ...................................
 */
router.post("/register", cors(), (req, res) => {
  User.register(
    { email: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.json({ success: false, message: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.json({ success: true, message: "Account successfully created" });
        });
      }
    }
  );
});

router.post("/login", cors(), (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      passport.authenticate("local")(req, res, () => {
        res.json({ success: true, message: "Login success" });
      });
    }
  });
});

router.post("/submitnote", cors(), (req, res) => {
  console.log(req.body);
  const note = new Note({
    title: req.body.title,
    body: req.body.body,
  });
  note
    .save()
    .then((result) => {
      res.json({ success: true, message: "Note Successfully saved", result });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
});

/*
 *   -----------------------------------
 *        PUT Requests
 *   ...................................
 */
// router.put();

/*
 *   -----------------------------------
 *        PATCH Requests
 *   ...................................
 */
// router.patch();

/*
 *   -----------------------------------
 *        DELETE Requests
 *   ...................................
 */
router.delete("/api/note/", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await Note.findByIdAndDelete(id);
    if (result) {
      res.json({ success: true, message: "Successfully deleted note: " + id });
    }
  } catch (err) {
    res.json({ success: true, message: err });
  }
});

module.exports = router;
