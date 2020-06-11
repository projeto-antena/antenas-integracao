let userInfo

$(document).ready(() => {
	const emailAluno = sessionStorage.getItem('sess_email_aluno')

    $.get(`/buscarAluno/${emailAluno}`, (data) => {
		userInfo = JSON.parse(data);
		$("#nome-aluno").text(userInfo.nome);
		$("#email-aluno").text(userInfo.email);
	})
	.fail(function () {
	     console.log("Failed")
	});

	$.get(`/buscarmedalha/${emailAluno}`, (data) => {
		data = JSON.parse(data);
		data.forEach((medalha) => {
			let element = `
			<div class="flex medal">
				<img class="medal-image" src="imgs/medalha_${medalha.medalha}.png">
				<p class="medal-competence">${medalha.competencia}</p>
				<span class="medal-description">${medalha.medalha}</span>
			</div>
			`
			$("#quadro-medalha").append(element);
		})
	})
})