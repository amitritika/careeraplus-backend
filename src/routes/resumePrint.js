const express = require("express");
const { printResumeFromHtml } = require("../controllers/resumePrint");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.post(
  "/resume/print/html",
  requireSignin,
  printResumeFromHtml
);

module.exports = router;
