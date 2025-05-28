"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authMiddleware.js.map