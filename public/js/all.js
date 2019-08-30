
	// Variável de cache do _id do Objeto no banco
	var idtf;
	// Variável de cache para atualização da tabela só quando necessário
	var updT = false;

	$("#limpar-campos1").click(function(){
		bootbox.dialog({
		title: 'Limpar campos',
		message: "Você tem certeza que deseja limpar todos os campos?",
		centerVertical: true,
			buttons: {
				ok: {
					label: ' SIM ',
					className: 'btn btn-outline-info',
					callback: function(){
						$("#nome").val("");
						$("#data-n").val("");
						$("#cpf").val("");
						$("#modelo-c").val("");
						hideAllMsgs();
					}
				},
				cancel: {
					label: 'NÃO',
					className: 'btn btn-outline-secondary'
				}
			},
		});
	});
	
	$("#consultar-a").click(function(){
		if($("#consultar-div").is( ":hidden" ) && updT){
			$("#table-motoristas").empty();
			getAllMot();
			updT = false;
		}
	});
	
	function hideAllMsgs(_fade){
		if(!_fade){
			$("#msg-e").hide();
			$("#msg-e2").hide();
			$("#msg-s").hide();
			$("#msg-s2").hide();
			$("#msg-s3").hide();
			return;
		}
		$("#msg-e").fadeOut();
		$("#msg-e2").fadeOut();
		$("#msg-s").fadeOut();
		$("#msg-s2").fadeOut();
		$("#msg-s3").fadeOut();
	}
	
	function verifyMotExists(){
		event.preventDefault();
		$.post("./mot-exists", {cpf: $("#cpf").val()})
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  createMot();
			  }else{
				  hideAllMsgs();
				  $("#msg-e").fadeIn();
				  setTimeout(function(){hideAllMsgs(true);}, 9000);
			  }
		});
	}

	function createMot(){
		var status_v = "INATIVO", sexo_v = "FEMININO";
		if($("#ativo").is(":checked")){
			status_v = "ATIVO"
		}
		if($("#masculino").is(":checked")){
			sexo_v = "MASCULINO"
		}
		$.post("./register-motorista", { 
			nome: $("#nome").val().toUpperCase(), 
			dt_nasc: $("#data-n").val(), 
			cpf: $("#cpf").val().toUpperCase(), 
			mod_carro: $("#modelo-c").val().toUpperCase(),
			status: status_v,
			sexo: sexo_v
		}).done(function(){
			hideAllMsgs();
			$("#msg-s").fadeIn();
			$("#consultar-div").hide();
			updT = true;
			setTimeout(function(){hideAllMsgs(true);}, 9000);
		});
	}
	
	function editarMot(id){
		$("#nome-e").val("");
		$("#data-n-e").val("");
		$("#cpf-e").val("");
		$("#modelo-c-e").val("");
		$('.nav-tabs a[href="#editar-div"]').removeClass('disabled');
		$('.nav-tabs a[href="#editar-div"]').tab('show');
		$('.nav-tabs a[href="#editar-div"]').addClass('disabled');
		$('.nav-tabs a[href="#editar-div"]').addClass('attcolor');
		getOneMot(id);
	}
	
	function updateMot(){
		event.preventDefault();
		var status_v = "INATIVO", sexo_v = "FEMININO";
		if($("#ativo-e").is(":checked")){
			status_v = "ATIVO"
		}
		if($("#masculino-e").is(":checked")){
			sexo_v = "MASCULINO"
		}
		$.post("./upd-mot", {
			_id: idtf,
			nome: $("#nome-e").val().toUpperCase(), 
			dt_nasc: $("#data-n-e").val(), 
			cpf: $("#cpf-e").val().toUpperCase(), 
			mod_carro: $("#modelo-c-e").val().toUpperCase(),
			status: status_v,
			sexo: sexo_v
			})
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
					hideAllMsgs();
					$("#msg-e2").fadeIn();
					setTimeout(function(){hideAllMsgs(true);}, 9000);
			  }else{
					hideAllMsgs();
					$("#msg-s2").fadeIn();
					$("#consultar-div").hide();
					updT = true;
					setTimeout(function(){hideAllMsgs(true);}, 9000);
			  }
		});
	}
	
	function getOneMot(id){
		$("#loading").fadeIn();
		$.post("./get-mot", {_id: $(id).attr("name")}).done(function( data ) {
				$("#nome-e").val(data.nome);
				$("#data-n-e").val(data.dt_nasc);
				$("#cpf-e").val(data.cpf);
				$("#modelo-c-e").val(data.mod_carro);
				if(data.status != "ATIVO"){
					$("#ativo-e").prop('checked', false);
					$("#inativo-e").prop('checked', true);
				}else{
					$("#ativo-e").prop('checked', true);
					$("#inativo-e").prop('checked', false);
				}
				if(data.sexo != "MASCULINO"){
					$("#masculino-e").prop('checked', false);
					$("#feminino-e").prop('checked', true);
				}else{
					$("#masculino-e").prop('checked', true);
					$("#feminino-e").prop('checked', false);
				}
				idtf = $(id).attr("name");
				$("#loading").fadeOut();
		});
	}
	
	function excluirMot(id){	
		bootbox.dialog({
		title: 'Exclusão de registro',
		message: "Você tem certeza que deseja excluir o registro?<br>Esta operação não pode ser desfeita.",
		centerVertical: true,
			buttons: {
				ok: {
					label: ' SIM ',
					className: 'btn btn-outline-danger',
					callback: function(){
						$.post("./del-mot", {_id: $(id).attr("name")}).done(function(data){
							idtf = "";
							hideAllMsgs();
							$("#msg-s3").fadeIn();
							$("#table-motoristas").empty();
							getAllMot();
							updT = false;
							setTimeout(function(){hideAllMsgs(true);}, 9000);
						});
					}
				},
				cancel: {
					label: 'NÃO',
					className: 'btn btn-outline-secondary'
				}
			},
		});
	}
	
	function getAllMot(){
		$("#loading").fadeIn();
		$.post("./get-all-mot")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  //$("#fullname-div").append("<b>Nada encontrada</b>.");
			  }else{
					data.forEach(
						function(data){
						$("#table-motoristas").append("<tr>"+
							"<td>"+data.nome+"</td>"+
							"<td align='center'>"+data.dt_nasc+"</td>"+
							"<td align='center'>"+data.cpf+"</td>"+
							"<td>"+data.mod_carro+"</td>"+
							"<td align='center'>"+data.status+"</td>"+
							"<td align='center'>"+data.sexo+"</td>"+
							"<td align='center' style='min-width: 91px;'><a onclick='editarMot(this)' name='"+data._id+"'><i class='fas fa-pen' style='color: #215c7d;'></i></a>"+
							"<a style='margin-left: 32px;' onclick='excluirMot(this)' name='"+data._id+"'><i class='fas fa-trash' style='color: #d22e2e;'></i></a>"+
							"</td>"+"</tr>"
							);
						}
					);
					$("#table-motoristas").append("</br></br>");
					$("#consultar-div").fadeIn(600);
					$('.nav-tabs a[href="#cadastrar-div"]').removeClass('disabled');
			  }
			  $("#loading").fadeOut();
		});
	}
	
	$(document).ready(function(){
	  $("#myInput").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$("#table-motoristas tr").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	  });
	});
	
	getAllMot();
	