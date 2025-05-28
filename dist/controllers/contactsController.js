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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsController = void 0;
const contactsModel_1 = require("../models/contactsModel");
const nodemailer = require('nodemailer');
const axios = require('axios');
class ContactsController {
    constructor() {
        this.contactsModel = new contactsModel_1.ContactsModel();
        this.add = this.add.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.emailgmail,
                pass: process.env.password_g
            }
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, comment, token } = req.body;
            if (!name || !email) {
                res.status(400).json({ error: 'Name and email are required' });
                return;
            }
            if (!token) {
                res.status(400).send("Debe completar el reCAPTCHA");
                return;
            }
            try {
                const fecha = new Date().toISOString();
                const responseIp = yield axios.get('https://api.ipify.org?format=json');
                const ip = responseIp.data.ip;
                const responsePais = yield axios.get(`${process.env.Url_Ipapi}${ip}?access_key=${process.env.Accesskey}`);
                const pais = responsePais.data.country_name;
                const recaptchaSecretKey = process.env.keyCapchat;
                const recaptchaVerificationResponse = yield axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
                    params: {
                        secret: recaptchaSecretKey,
                        response: token,
                        remoteip: ip,
                    },
                });
                if (recaptchaVerificationResponse.data.success) {
                    const mailOptions = {
                        from: process.env.emailgmail,
                        to: [email, process.env.email2, process.env.email1],
                        subject: 'Nuevo comentario',
                        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${comment}\nIp: ${ip}\nPais de origen: ${pais}\nFecha: ${fecha}`
                    };
                    this.transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log(`Correo enviado: ${info.response}`);
                        }
                    });
                    yield this.contactsModel.addContact(name, email, comment, ip, fecha, pais);
                    console.log(`Nuevo contacto agregado: ${name}, ${email}, ${comment}, ${ip}, ${fecha}, ${pais}`);
                    res.status(200).send("Enviado con éxito");
                }
                else {
                    console.error('Recaptcha verification failed:', recaptchaVerificationResponse.data['error-codes']);
                    res.status(400).send("Error en la verificación del reCAPTCHA");
                }
            }
            catch (error) {
                console.error('Error processing contact form:', error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    getContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield this.contactsModel.getAllContacts();
                res.render('pages/admin/contacts', { contacts });
            }
            catch (error) {
                console.error('Error al obtener los contactos:', error);
                res.status(500).send('Error al obtener los contactos.');
            }
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield this.contactsModel.getAllContacts();
                res.render('pages/admin/contacts', { contacts });
            }
            catch (error) {
                console.error('Error al obtener los contactos:', error);
                res.status(500).send('Error al obtener los contactos.');
            }
        });
    }
}
exports.ContactsController = ContactsController;
//# sourceMappingURL=contactsController.js.map