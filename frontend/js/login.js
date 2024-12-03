const buttonLogin = document.getElementById('button-entrar');

buttonLogin.addEventListener('click', async (ev) => {
    ev.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const errors = validateForm(email, password);
    if (errors.length > 0) {
        displayErrors(errors);
        return;
    }

    const response = await loginUser(email, password);
    
    if (response.auth && response.token) {
        console.log('Usuário autenticado:', response.user);
        localStorage.setItem('authToken', response.token);
        console.log('Redirecionando para /profile...');
        window.location.href = '/profile';
    } else {
        displayErrors(response.message || 'Erro desconhecido ao tentar se autenticar.');
    }
});

function validateForm(email, password) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
        errors.push('Todos os campos são obrigatórios');
    } else if (!emailRegex.test(email)) {
        errors.push('E-mail inválido.');
    } else if (password.length < 8) {
        errors.push('A senha deve conter pelo menos 8 caracteres.');
    }

    return errors;
}

async function loginUser(email, password) {
    const response = await fetch('/auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    return await response.json();
}

function displayErrors(errors) {
    const errorContainer = document.getElementById('msg');
    errorContainer.innerHTML = ''; 
    if (typeof errors === 'string') {
        createErrorElement(errors);
    } else if (Array.isArray(errors)) {
        errors.forEach((error) => createErrorElement(error));
    }
}

function createErrorElement(message) {
    const errorElement = document.createElement('p');
    errorElement.textContent = message;
    errorElement.classList.add('error-message');
    document.getElementById('msg').appendChild(errorElement);
}
