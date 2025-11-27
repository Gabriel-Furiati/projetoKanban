console.log('script que roda no front - js/main.js')
function confirmarAcao(id){
    const resultado = confirm('Você tem certeza que deseja excluir este item?')
    if(resultado){
        fetch('/excluirexemplo/'+id)
        .then(response => response.text())
        .then(data => {
            console.log('Resposta do servidor:', data);
            window.location.replace('/');
        })
        .catch(err => console.error(err));
    } else {
        alert('Ação cancelada!');
    }
}