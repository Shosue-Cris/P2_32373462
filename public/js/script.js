 function showMessage(msg, type) {
        const el = document.getElementById('form-message');
        el.textContent = msg;
        el.style.color = type === 'success' ? '#28a745' : '#dc3545';
        el.style.marginTop = '10px';
      }

      document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const name = document.getElementById('name').value.trim();
        const comment = document.getElementById('comment').value.trim();
         const recaptcha = document.getElementById('g-recaptcha-response');
            const token = recaptcha.value;

        if (!name || !email || !comment) {
          showMessage('Todos los campos son requeridos', 'error');
          return;
        }
        if (!token) {
          showMessage('Debe completar el reCAPTCHA', 'error');
          return;
        }

        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
const response = await fetch('/contact/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, comment, token })
          });
          console.log(response.body);
          console.log(response.status);
          if (response.status === 200) {
            showMessage('Comentario enviado correctamente', 'success');
            document.getElementById('contactForm').reset();
            grecaptcha.reset();
             submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Reseña';
          } else {
            const result = await response.text();
            showMessage(result || 'Error al enviar el comentario', 'error');
          }
       
      });

