"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.isAuthenticated);
router.get('/', (req, res) => {
    res.render('pages/admin/dashboard');
});
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map