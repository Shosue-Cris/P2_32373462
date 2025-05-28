"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
class UserController {
    constructor() {
        this.userModel = new userModel_1.UserModel();
        this.register = this.register.bind(this);
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, confirmPassword } = req.body;
            console.log(`Intento de registro de usuario: ${username}, correo: ${email}`);
            console.log(`Contraseña proporcionada: ${password}`);
            console.log(`Confirmación de contraseña proporcionada: ${confirmPassword}`);
            if (!username || !email || !password || !confirmPassword) {
                res.status(400).send('Todos los campos son obligatorios.');
                return;
            }
            if (password !== confirmPassword) {
                res.status(400).send('La contraseña y la confirmación no coinciden.');
                return;
            }
            try {
                const existingUserByUsername = yield this.userModel.findUserByUsername(username);
                console.log(existingUserByUsername);
                if (existingUserByUsername.length > 0) {
                    res.status(400).send('El nombre de usuario ya está registrado.');
                    return;
                }
                const existingUserByEmail = yield this.userModel.findUserByEmail(email);
                if (existingUserByEmail.length > 0) {
                    res.status(400).send('El correo electrónico ya está registrado.');
                    return;
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                yield this.userModel.createUser(username, email, hashedPassword);
                res.redirect('/login');
            }
            catch (error) {
                console.error('Error en el registro de usuario:', error);
                res.status(500).send('Error en el servidor durante el registro.');
            }
        });
    }
    forgotPasswordRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(400).send('El correo es obligatorio');
            }
            try {
                const user = yield this.userModel.findUserByEmail(email);
                if (user) {
                    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
                    const resetTokenExpires = Date.now() + 3600000; // 1 hora
                    yield this.userModel.saveResetToken(user.id, resetToken, resetTokenExpires);
                    console.log(`Password reset link: http://localhost:3000/password/reset/${resetToken}`);
                }
                res.send('Si el correo electrónico está registrado, se ha enviado un enlace de restablecimiento.');
            }
            catch (error) {
                console.error('Error en la solicitud de recuperación de contraseña:', error);
                res.status(500).send('Error en el servidor durante la solicitud de recuperación.');
            }
        });
    }
    renderResetPasswordForm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            try {
                const user = yield this.userModel.findUserByResetToken(token);
                if (user) {
                    res.render('pages/reset-password', { token });
                }
                else {
                    res.status(400).send('Token de restablecimiento inválido o expirado.');
                }
            }
            catch (error) {
                console.error('Error al renderizar el formulario de restablecimiento:', error);
                res.status(500).send('Error en el servidor al procesar el token de restablecimiento.');
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, password, confirmPassword } = req.body;
            if (!password || !confirmPassword) {
                res.status(400).send('La nueva contraseña y la confirmación son obligatorias.');
            }
            if (password !== confirmPassword) {
                res.status(400).send('La nueva contraseña y la confirmación no coinciden');
            }
            try {
                const user = yield this.userModel.findUserByResetToken(token);
                if (!user) {
                    res.status(400).send('Token de restablecimiento inválido o expirado.');
                }
                // Hash the new password
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                console.log(`Usuario ${user.username} (ID: ${user.id}) - Nueva contraseña hasheada lista para actualizar.`);
                console.log(`Token de restablecimiento ${token} listo para ser invalidado/eliminado.`);
                res.redirect('/login?message=passwordResetSuccess');
            }
            catch (error) {
                console.error('Error al restablecer la contraseña:', error);
                res.status(500).send('Error en el servidor durante el restablecimiento de contraseña.');
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).send('Nombre de usuario/correo electrónico y contraseña son obligatorios.');
                return;
            }
            try {
                let user = yield this.userModel.findUserByUsername(username);
                if (!user) {
                    user = yield this.userModel.findUserByEmail(username);
                }
                if (!user) {
                    res.status(400).send('Credenciales incorrectas.');
                    return;
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (passwordMatch) {
                    req.session.userId = user.id;
                    res.redirect('/admin/contacts');
                }
                else {
                    res.status(400).send('Credenciales incorrectas.');
                }
            }
            catch (error) {
                console.error('Error en el inicio de sesión:', error);
                res.status(500).send('Error en el servidor durante el inicio de sesión.');
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.destroy(err => {
                if (err) {
                    console.error('Error al cerrar la sesión:', err);
                    res.status(500).send('Error al cerrar la sesión.');
                }
                else {
                    res.redirect('/');
                }
            });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map