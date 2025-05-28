# Valery's Green - Documentación de Implementación (TypeScript)

Este proyecto implementa un sistema web en TypeScript con funcionalidades avanzadas de geolocalización, seguridad, notificaciones y pagos simulados. A continuación se detallan las principales integraciones y cómo se implementan en el código.

---

## 1. Geolocalización por IP

**Objetivo:** Identificar el país del usuario que completa el formulario de contacto y almacenarlo en la base de datos.

- Se utiliza la API de [ipapi](https://ipapi.com/) para obtener la geolocalización a partir de la IP pública del usuario.
- En `ContactsController.add`, tras recibir el formulario:
    - Se obtiene la IP pública con `https://api.ipify.org?format=json`.
    - Se consulta la API de ipapi usando la IP y la clave de acceso almacenada en .env.
    - El país (`country_name`) se almacena junto con el resto de los datos del contacto en la base de datos (`ContactsModel.addContact`).

---

## 2. Google Analytics

**Objetivo:** Recopilar estadísticas de visitas y analizar el comportamiento de los usuarios.

- Agrega el script de Google Analytics en el archivo de layout principal `main-layout.ejs` antes de la etiqueta `</head>`.
- Ejemplo de integración:
        ```html
        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=TU_ID_ANALYTICS"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'TU_ID_ANALYTICS');
        </script>
        ```
- Puedes configurar eventos personalizados para rastrear interacciones clave.

---

## 3. Google reCAPTCHA

**Objetivo:** Proteger el formulario de contacto contra bots y spam.

- El formulario de reseñas en `index.ejs` incluye el widget de reCAPTCHA.
- En el frontend, el token de reCAPTCHA se envía junto con los datos del formulario (`public/js/script.js`).
- En el backend, `ContactsController.add` valida el token usando la API de Google reCAPTCHA y la clave secreta almacenada en .env.
- Si la validación falla, el formulario no se procesa.

---

## 4. Notificación por correo electrónico

**Objetivo:** Enviar un correo a una lista de destinatarios cada vez que se complete el formulario.

- Se utiliza `nodemailer` para enviar correos desde el backend.
- En `ContactsController.add`, tras validar el formulario y el reCAPTCHA:
    - Se envía un correo a los destinatarios definidos en las variables de entorno (`emailgmail`, `email1`, `email2`).
    - El correo incluye nombre, correo, comentario, IP, país y fecha/hora.
    - La dirección `programacion2ais@yopmail.com` está incluida en la lista de destinatarios.

---

## 5. Integración con Fake Payment API

**Objetivo:** Simular pagos usando la API de [https://fakepayment.onrender.com/](https://fakepayment.onrender.com/).

- El formulario de pagos envía los datos a `/payment/add` usando `pagoscript.js`.
- En el backend, `PaymentController.add` recibe los datos y realiza una petición POST a la Fake Payment API usando el token almacenado en .env.
- La respuesta se muestra al usuario.

---

## 6. Seguridad y Variables de Entorno

- Todas las credenciales sensibles (claves de API, tokens, contraseñas de correo, etc.) se almacenan en el archivo `.env` (ver `.env`).
- El archivo `.env` está incluido en `.gitignore` y **no debe subirse al repositorio**.
- Ejemplo de variables en `.env`:
        ```
        Url_Ipapi=http://api.ipapi.com/api/
        Accesskey=XXXXXXXXXXXX
        keyCapchat=XXXXXXXXXXXX
        emailgmail=xxxx@gmail.com
        password_g=xxxx xxxx xxxx xxxx
        email1=xxxx@gmail.com
        email2=programacion2ais@yopmail.com
        keyfakepayment=XXXXXXXXXXXX
        ```

---


