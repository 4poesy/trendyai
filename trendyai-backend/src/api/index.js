import express from "express";

import agents from "./agents.js";
import audits from "./audits.js";
import clients from "./clients.js";
import emojis from "./emojis.js";
import tasks from "./tasks.js";
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
router.use("/agent", agents);
router.use("/tasks", tasks);
router.use("/audits", audits);

export default router;
