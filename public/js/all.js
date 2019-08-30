
	// Variável de cache do _id do Objeto no banco
	var idtf;
	// Variável de cache para atualização da tabela só quando necessário
	var updT = false;
	// Variável de cache para atualização só quando houver alterações nos dados 
	var register = {};

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
						$("#loading").fadeIn();
						$("#nome").val("");
						$("#data-n").val("");
						$("#cpf").val("");
						$("#modelo-c").val("");
						hideAllMsgs();
						$("#loading").fadeOut();
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
	
	$("#voltar-m").click(function(){
		$('.nav-tabs a[href="#consultar-div"]').tab('show');
	});
	
	function hideAllMsgs(_fade){
		if(!_fade){
			$("#msg-e").hide();
			$("#msg-e2").hide();
			$("#msg-e3").hide();
			$("#msg-s").hide();
			$("#msg-s2").hide();
			$("#msg-s3").hide();
			return;
		}
		$("#msg-e").fadeOut();
		$("#msg-e2").fadeOut();
		$("#msg-e3").fadeOut();
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
	// Converte a String de Data_Nascimento para DD-MM-YYYY ou YYYY-MM-DD
	function convertDateTo(data, reverse = false){
		if(reverse){
			return data.substring(6, 10) + "-" + data.substring(3, 5) + "-" + data.substring(0, 2);
		}
		return data.substring(8, 10) + "-" + data.substring(5, 7) + "-" + data.substring(0, 4);
	}

	function createMot(){
		$("#loading").fadeIn();
		var status_v = "INATIVO", sexo_v = "FEMININO";
		if($("#ativo").is(":checked")){
			status_v = "ATIVO"
		}
		if($("#masculino").is(":checked")){
			sexo_v = "MASCULINO"
		}
		$.post("./register-motorista", { 
			nome: $("#nome").val().toUpperCase(), 
			dt_nasc: convertDateTo($("#data-n").val()), 
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
		$("#loading").fadeOut();
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
	
	function noChanges(status_v, sexo_v){
		if(register.nome != $("#nome-e").val().toUpperCase()){
			register.nome = $("#nome-e").val().toUpperCase();
			return false;
		}
		if(register.data_nasc != $("#data-n-e").val()){
			register.data_nasc = $("#data-n-e").val();
			return false;
		}
		if(register.cpf != $("#cpf-e").val().toUpperCase()){
			register.cpf = $("#cpf-e").val().toUpperCase();
			return false;
		}
		if(register.mod_carro != $("#modelo-c-e").val().toUpperCase()){
			register.mod_carro = $("#modelo-c-e").val().toUpperCase();
			return false;
		}
		if(register.status != status_v){
			register.status = status_v;
			return false;
		}
		if(register.sexo != sexo_v){
			register.sexo = sexo_v;
			return false;
		}
		return true;
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
		if(noChanges(status_v, sexo_v)){
			hideAllMsgs();
			$("#msg-e3").fadeIn();
			setTimeout(function(){hideAllMsgs(true);}, 9000);
			return;
		}
		$.post("./upd-mot", {
			_id: idtf,
			nome: $("#nome-e").val().toUpperCase(), 
			dt_nasc: convertDateTo($("#data-n-e").val()), 
			cpf: $("#cpf-e").val().toUpperCase(), 
			mod_carro: $("#modelo-c-e").val().toUpperCase(),
			status: status_v,
			sexo: sexo_v
			})
		  .done(function( data ) {
			  $("#loading").fadeIn();
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
			  $("#loading").fadeOut();
		});
	}
	
	function getOneMot(id){
		$("#loading").fadeIn();
		$.post("./get-mot", {_id: $(id).attr("name")}).done(function( data ) {
				$("#nome-e").val(data.nome);
				$("#data-n-e").val(convertDateTo(data.dt_nasc, true));
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
				register = {};
				register.nome = data.nome;
				register.data_nasc = convertDateTo(data.dt_nasc, true);
				register.cpf = data.cpf;
				register.mod_carro = data.mod_carro;
				register.status = data.status;
				register.sexo = data.sexo;
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
					if(data.length == 0){
						$("#table-motoristas").append("<tr><td colspan='6' align='center'>Sem registros</td></tr>");
					}
					$("#table-motoristas").append("</br>");
					if(data.length < 5){
						$("#table-motoristas").append("</br></br>");
					}
					if(data.length < 3){
						$("#table-motoristas").append("</br></br></br></br>");
					}
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
	