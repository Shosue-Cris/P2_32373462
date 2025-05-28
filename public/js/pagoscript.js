document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value.trim(),
        cardholderName: document.getElementById('cardholderName').value.trim(),
        cardNumber: document.getElementById('cardNumber').value.trim(),
        expirationMonth: document.getElementById('expiryMonth').value,
        expirationYear: document.getElementById('expiryYear').value,
        cvv: document.getElementById('cvv').value.trim(),
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    if (Object.values(formData).some(value => !value)) {
        showMessage('Todos los campos son requeridos', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    try {
        const response = await fetch('http://localhost:3005/payment/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage(`¡Pago realizado con éxito!`, 'success');
            e.target.reset();
        } else {
            showMessage(result.message || 'Error al procesar el pago', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Realizar Pago';
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('responseMessage');
    messageDiv.innerHTML = `<p>${message}</p>`;
    messageDiv.className = type;
}