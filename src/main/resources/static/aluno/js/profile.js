$(document).ready(() => {
    let aluno
    console.log(sessionStorage.getItem('sess_email_aluno'))
    $.get(`/buscarAluno/${sessionStorage.getItem('sess_email_aluno')}`, function(data) {
		let userInfo = JSON.parse(data);
		$("#nome-aluno").text(userInfo.nome);
		$("#email-aluno").text(userInfo.email);
	})
	.fail(function () {
	     console.log("falhou ;-;")
	});
})