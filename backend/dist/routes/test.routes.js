"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/protected", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({ message: "You are authorized" });
});
exports.default = router;
