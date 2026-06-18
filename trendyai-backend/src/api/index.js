import express from "express";

import clients from "./clients.js";
import emojis from "./emojis.js";
import users from "./users.js";
import agents from "./agents.js";
import tasks from "./tasks.js";

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

export default router;
