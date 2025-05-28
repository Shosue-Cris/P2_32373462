import { Request, Response } from 'express';
import { ContactsModel } from '../models/contactsModel';
const nodemailer = require('nodemailer');
const axios = require('axios');

export class ContactsController {
    private contactsModel: ContactsModel;
    private transporter: any;

    constructor() {
        this.contactsModel = new ContactsModel();
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

    public async add(req: Request, res: Response): Promise<void> {
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
            const responseIp = await axios.get('https://api.ipify.org?format=json');
            const ip = responseIp.data.ip;
            const responsePais = await axios.get(`${process.env.Url_Ipapi}${ip}?access_key=${process.env.Accesskey}`);
            const pais = responsePais.data.country_name;

            const recaptchaSecretKey = process.env.keyCapchat;
            const recaptchaVerificationResponse = await axios.post(
                'https://www.google.com/recaptcha/api/siteverify',
                null,
                {
                    params: {
                        secret: recaptchaSecretKey,
                        response: token,
                        remoteip: ip,
                    },
                }
            );

            if (recaptchaVerificationResponse.data.success) {
                const mailOptions = {
                    from: process.env.emailgmail,
                    to: [email, process.env.email2,process.env.email1],
                    subject: 'Nuevo comentario',
                    text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${comment}\nIp: ${ip}\nPais de origen: ${pais}\nFecha: ${fecha}`
                };
                this.transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Correo enviado: ${info.response}`);
                    }
                });
                await this.contactsModel.addContact(name, email, comment, ip, fecha, pais);
                console.log(`Nuevo contacto agregado: ${name}, ${email}, ${comment}, ${ip}, ${fecha}, ${pais}`);
                res.status(200).send("Enviado con éxito");
            } else {
                console.error('Recaptcha verification failed:', recaptchaVerificationResponse.data['error-codes']);
                res.status(400).send("Error en la verificación del reCAPTCHA");
            }
        } catch (error) {
            console.error('Error processing contact form:', error);
            res.status(500).send("Error interno del servidor");
        }
    }

    public async getContacts(req: Request, res: Response): Promise<void> {
        try {
            const contacts = await this.contactsModel.getAllContacts();
            res.render('pages/admin/contacts', { contacts });
        } catch (error) {
            console.error('Error al obtener los contactos:', error);
            res.status(500).send('Error al obtener los contactos.');
        }
    }

    public async index(req: Request, res: Response): Promise<void> {
        try {
            const contacts = await this.contactsModel.getAllContacts();
            res.render('pages/admin/contacts', { contacts });
        } catch (error) {
            console.error('Error al obtener los contactos:', error);
            res.status(500).send('Error al obtener los contactos.');
        }
    }
}