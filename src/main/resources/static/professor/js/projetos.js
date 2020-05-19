/**/
var session_login = sessionStorage.getItem("sess_email_professor");


if(session_login == null){
        window.location.href = 'index.html';
}else{

  $(document).ready(function () {
      let projects;
    
/* Informações do Usuário Professor */
      $.post("/professorLogado", JSON.stringify({'email': session_login}), function(user){
        userData(user);
      }, "json");
 
    
/* </> Informações do Usuário Professor */


       /* <> Rotas de inicialização dos objetos */
      $.get('/myprojects', session_login)
          .done(function(projetos){
          projects = JSON.parse(projetos);
          insertMyProjects(projects);
      });
      
       /* </> Rotas de inicialização dos objetos */

      /* <> Funções */
    
      /* listagem de projetos do professor */
      function insertMyProjects(projecs) {
        
        console.log(projecs);
        let tbody = $('[data-myProjects-table-body]');
    
        projecs.forEach(project => {
          let project_id = project._id.$oid;
          let tr2 = $.parseHTML(`<tr data-project-item="${ project._id }> 
            <th scope="row">${ project.titulo }</th>
                <td>${ project.titulo }</td>
                <td>${ project['descricao-breve'] }</td>
                <td>Nome da Empresa</td>
                <td id="td-key">${project['chave'] != null ? project['chave'] : '<input type="text" class="form-control" id="keyAlId-'+project_id+'" name="key_al" placeholder="Inserir Chave">'}<td>
                <td id="td-alkey-${project_id}"></td>
                <td id="td-alunos-${project_id}"></td>
            </tr>
          `);
   
          tbody.append(tr2);

          /*Gerando Chave de Acesso do Aluno td-alkey */
          let generateKey = $.parseHTML(`<button type="button" class="btn btn-primary">
              Gerar Chave
          </button>
          </li>`);

          let removeKey = $.parseHTML(`<button type="button" class="btn btn-danger">
              Remover Chave
          </button>
          </li>`);

          if(project['chave'] == null){
            let $generateKey = $(generateKey);
            $generateKey.click(function(e){
              e.preventDefault();
              var myKey = $('#keyAlId-'+project_id).val();
            
              if (confirm('Deseja realmente alterar o chave dos alunos ?')) {
                $.post("/updateProjetoProfessor", JSON.stringify({'_id':project._id, 'chave': myKey}), "json");
                location.reload();
              }
            });
  
            $('#td-alkey-'+project_id).append(generateKey);
            /* </ >Gerando Chave de Acesso do Aluno td-alkey </ >*/
          }
          else{
            let $removeKey = $(removeKey);
            $removeKey.click(function(e){
              e.preventDefault();
              var myKey = null;
              if (confirm('Deseja realmente alterar o chave dos alunos ?')) {
                $.post("/updateProjetoProfessor", JSON.stringify({'_id':project._id, 'chave': myKey}), "json");
                location.reload();
              }
            });
  
            $('#td-alkey-'+project_id).append(removeKey);
           
          }
         

          /*Gerenciar alunos presentes td-alunos*/
          let AlPresentes = $.parseHTML(`
          <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-alunos-presentes">
             Alunos Presentes
          </button>
          </li>`);

          let $AlPresentes = $(AlPresentes);

          $AlPresentes.click(function(e){
            e.preventDefault();
            _AlunosPresentes(project);
          });

          $('#td-alunos-'+project_id).append(AlPresentes);
          /*</ >Gerenciar alunos presentes td-alunos</ >*/
        });
      }


function userData(user){
      /* <> Logou do Usuário */
      let navPROF = $('[data-user]');
      let logout = $.parseHTML(`
      <li><i class="fa fa-sign-out" aria-hidden="true"></i> 
      <button type="button" class="btn btn-danger">Logout</button></li>`);

      let $logout = $(logout);
      $logout.click(function(e) {
          e.preventDefault();
          if (confirm('Realmente deseja Sair ?')) {
              sessionStorage.clear(session_login);
              window.location.href = 'index.html';
          }
      });
      
      /* Alterar Senha */
      let updateSenha = $.parseHTML(`
      <li><i class="fa fa-sign-out" aria-hidden="true"></i>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-update-senha">
          Alterar Senha
      </button>
      </li>`);

      let avaliarAluno = $.parseHTML(`
      <li><i class="fa fa-evaluate-aluno" aria-hidden="true"></i>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-avaliar-aluno">
          Avaliar aluno
      </button>
      </li>`);

      let $updateSenha = $(updateSenha);
      $updateSenha.click(function(e){
        e.preventDefault();
        _formUpdateSenha(user);
      });
 
      let $avaliarAluno = $(avaliarAluno);
      $avaliarAluno.click(function(e){
        e.preventDefault();
        _formAvaliarAluno();
      });

      /* </> Alterar Senha */

      /* </> Logou do Usuário */

      /* Pupula Usuário Data */
      let data = $.parseHTML(`
      <li>${user.nome}</li>
      <li>Professor</li>`);
      /* </> Pupula Usuário Data */
    
      navPROF.append(data);
      navPROF.append(avaliarAluno);
      navPROF.append(updateSenha);
      navPROF.append(logout);
      $("li").addClass("list-inline-item");
  }

/* </> Funções */

  
});

}




function _AlunosPresentes(project){

  let form_alunos =  $.parseHTML(`
    <div class="modal fade" id="modal-alunos-presentes" tabindex="-1" role="dialog" aria-labelledby="modal-alunos-presentes" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Alunos do Projeto</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" >
          <div id="alunos" class="container"><br>
          <table class="table">
              <thead class="thead-dark">
                  <tr>
                      <td scope="col">Email</td>
                      <td></td>
                  </tr>
              </thead>
              <tbody id="tabela-alunos" td_body_aluno>

              </tbody>
          </table>
      </div>
        </div>
        <div class="modal-footer" >
        
        </div>
    </div>
  </div>`);
  /* Evento insere modal no HTML */
  $(document.body).prepend(form_alunos);
  /* Evento Remove modal do HTML */
  $('.close').click(function(e){
    e.preventDefault();
    $("#modal-update-senha").remove();
    $(".modal-backdrop ").remove();
  });


  project.alunos.forEach(aluno => {
    let remover = project.alunos.indexOf(aluno)
    let td =  $.parseHTML(`<tr data-alunos-item="${aluno}> 
            <th scope="row">${aluno}</th>
                <td>${aluno}</td>
                <td btn-remove-al-${remover}></td>
            </tr>
          `);

    let btn_remove = $.parseHTML(`<button type="button" class="btn btn-danger">Remover</button>`);
    let $btn_remove = $(btn_remove);
    $btn_remove.click(function(e){
       project.alunos.splice(remover, 1);
        $.post("/updateProjetoProfessor", JSON.stringify({'_id':project._id, 'alunos': project.alunos}), "json");
        $(this).closest('tr').remove();
    });

    $('[td_body_aluno]').append(td);
    $('[btn-remove-al-'+remover+']').append(btn_remove);
  });
}


function fechaPopupSemDono(event) {
  event.preventDefault();
  document.getElementById('modal_semdono').style.display='none';    
}


function _formUpdateSenha(user){

  let form_senha =  `
    <div class="modal fade" id="modal-update-senha" tabindex="-1" role="dialog" aria-labelledby="modal-update-senha" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Alteração de Senha</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
       Senha: <input class="form-control"  type="password" id="senha-antiga" name="senha-antiga" placeholder="Senha Atual" style="max-width:350px" required>
       Nova Senha: </label><input class="form-control" type="password" id="senha-nova1" name="senha-nova1" placeholder="Nova Senha" style="max-width:350px" required>
       Nova Senha Novamente: </label><input class="form-control" type="password" id="senha-nova2" name="senha-nova2" placeholder="Nova Senha" style="max-width:350px" required>
        </div>
        <div class="modal-footer" >
          <button type="submit" class="btn btn-primary alterarSenha" id="alterarSenha">Salvar mudanças</button>
          <div id="modal-footer-password"></div>
          </div>
      </div>
    </div>
  </div>`;

  /* Evento insere modal no HTML */
  $(document.body).prepend(form_senha);
  /* Evento Remove modal do HTML */
  $('.close').click(function(e){
    e.preventDefault();
    $("#modal-update-senha").remove();
    $(".modal-backdrop ").remove();
  });
  /* Evento submita a senha nova */
  $('#alterarSenha').click(function(e){
    e.preventDefault();
    $("#modal-footer-password").html('');
    var senhaAntiga = $("#senha-antiga").val();
    var senha1 = $("#senha-nova1").val();
    var senha2 = $("#senha-nova2").val();
    
 
    if(senhaAntiga === user.senha && senhaAntiga != null){
        if(senha1 === senha2 && senha1 != null && senha2 != null){
          $.post("/updateProfessor", JSON.stringify({'_id':user._id, 'senha': senha1}), "json");
          $('#modal-footer-password').append($.parseHTML(`<div class="alert alert-success" role="alert">
          Senha alterada com sucesso</div>`));
        }else{
          $('#modal-footer-password').append($.parseHTML(`<div class="alert alert-danger" role="alert">
          Senha de nova ou senha de confirmação inválidas ou não correspondentes.</div>`));
        }
    }else{
      $('#modal-footer-password').append($.parseHTML(`<div class="alert alert-danger" role="alert">
          Senha não corresponde com a atual!, por favor insira a senha correta.
      </div>`));
    }
  });
}

function _formAvaliarAluno() {
    let form_avaliacao =  `
    <div class="modal fade" id="modal-avaliar-aluno" tabindex="-1" role="dialog" aria-labelledby="modal-avaliar-aluno" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Avaliar aluno</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Aluno: <input class="form-control" id="nome-aluno" name="name-aluno" placeholder="Aluno" style="max-width:100%" required>
          </br>
       	  Competencia: <input class="form-control" id="nome-competencia" name="name-competencia" placeholder="Competencia" style="max-width:100%" required>
          </br>
          Nivel na competencia:
          </br></br>
          <img height="10%" width="10%" hspace="11%" src="imgs/medalha_bronze.png">
          <img height="10%" width="10%" hspace="11%" src="imgs/medalha_prata.png">
          <img height="10%" width="10%" hspace="11%" src="imgs/medalha_ouro.png">
          <label style="margin:0 13% 0 12.9%">
	          <input type="radio" name="medal" value="1" style="margin:0 13% 0 13%">
	          <span>Bronze</span>
	      </label>
	      <label style="margin:0 0 0 4.6%">
	      	  <input type="radio" name="medal" value="2" style="margin:0 17.5% 0 17.5%">
	      	  <span>Prata</span>
	      </label>
	      <label style="margin:0 0 0 21.2%">
	          <input type="radio" name="medal" value="3" style="margin:0 0 0 13%">
	          <span>Ouro</span>
	      </label>
        </div>
        <div class="modal-footer" >
          <button type="submit" class="btn btn-primary avaliarAluno" id="avaliarAluno">Avaliar</button>
          <div id="modal-footer-avaliar"></div>
          </div>
      </div>
    </div>
  </div>`;

  /* Evento insere modal no HTML */
  $(document.body).prepend(form_avaliacao);
  /* Evento Remove modal do HTML */
  $('.close').click(function(e){
    e.preventDefault();
    $("#modal-avaliar-aluno").remove();
    $(".modal-backdrop ").remove();
  });
  
  /* Evento submita a avalia��o */
  $('#avaliarAluno').click(function(e){
  	alert("Funciona!");
  });
}
