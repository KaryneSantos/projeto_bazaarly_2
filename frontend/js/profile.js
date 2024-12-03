const token = localStorage.getItem('authToken');
console.log('Token enviado:', token);

if (!token) {
    alert('Você precisa estar logado para acessar esta página!');
    window.location.href = '/auth';
} else {
    fetch('http://localhost:3000/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        credentials: 'include'
    })

    console.log('Token Autorizado:', {
        'Authorization': token
    })

    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Dados do usuário:', data.user);
        } else {
            console.error('Erro na autenticação:', data.message);
        }
    })
    .catch(err => {
        console.error('Erro ao acessar perfil:', err);
        alert('Erro ao acessar o perfil.');
    });
}
