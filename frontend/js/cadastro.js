const buttonSign = document.getElementById('signup-btn');

buttonSign.addEventListener('click', async(ev)=> {
    ev.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const conf_password = document.getElementById('confirm_password').value;
    const type = document.getElementById('user_type').value;

    if(!name) {
        displayErrors('Todos os campos são obrigatórios.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayErrors('E-mail inválido.');
        return;
    }

    if(password.length < 8) {
        displayErrors('A senha deve conter pelo menos 8 caracteres.');
        return;
    }

    if(!password || !conf_password) {
        displayErrors('Senha é obrigatório.');
        return;
    }

    if(password != conf_password) {
        displayErrors('As senhas não coincidem.');
        return;
    }

    try{
        const response = await fetch('/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password, confirm_password: conf_password, user_type: type}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                window.location.href = '/login';
            } else {
                alert('Erro no cadastro: ' + data.message);
            }
        })
    } catch (err) {
        console.error('Erro ao enviar o formulário:', err);
    }
});

function displayErrors(errors) {
    const errorContainer = document.getElementById('msg');
    errorContainer.innerHTML = '';

    if (typeof errors === 'string') {
        const errorElement = document.createElement('p');
        errorElement.textContent = errors;
        errorElement.classList.add('error-message');
        console.log(errorElement);
        errorContainer.appendChild(errorElement);
    } else if (Array.isArray(errors)) {
        errors.forEach((error) => {
            const errorElement = document.createElement('p');
            errorElement.textContent = error.msg;
            errorElement.classList.add('error-message');
            console.log(errorElement);
            errorContainer.appendChild(errorElement);
        });
    }
}