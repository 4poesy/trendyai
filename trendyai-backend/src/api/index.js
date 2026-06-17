import express from "express";

import clients from "./clients.js";
import emojis from "./emojis.js";
import users from "./users.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/clients", clients);
router.use("/emojis", emojis);
router.use("/users", users);

export default router;
