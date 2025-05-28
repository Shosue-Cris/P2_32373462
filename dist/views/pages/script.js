document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const API_URL = 'http://localhost:3000';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
});
    
    if (!name || !email || !message) {
        showMessage('Todos los campos son requeridos', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const response = await fetch('http://localhost:3000/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        
        if (response.ok) {
            const fecha = new Date(result.timestamp).toLocaleString();
            showMessage(`<small>Mensaje enviado el ${fecha}</small>`, 'success');
            alert("Su mensaje se envio con exito")
            document.getElementById('contactForm').reset();
        } else {
            showMessage(result.error || 'Error al enviar el mensaje', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('responseMessage');
    messageDiv.innerHTML = `<p>${message}</p>`;
    messageDiv.className = type; 
}