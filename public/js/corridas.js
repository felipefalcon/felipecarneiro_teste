
	// Variável de cache do _id do Objeto no banco
	var idtf;
	// Variável de cache para atualização da tabela só quando necessário
	var updT = false;
	// Variável de cache para atualização só quando houver alterações nos dados 
	var register = {};
	// Variável de cache para seleção de motorista e passageiro no cadastro
	var motCh = false;
	var pasCh = false;

	$("#consultar-a").click(function(){
		if($("#consultar-div").is( ":hidden" ) && updT){
			$("#table-motoristas").empty();
			getAllMot();
			updT = false;
		}
		$("html, body").animate({ scrollTop: 0 }, "slow");
	});
	
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
						pasCh = true;
						motCh = true;
						$("#search-cor1").val("");
						$("#search-cor2").val("");
						setMot(register.tr_id1);
						setPas(register.tr_id2);
						register.tr_id1 = null;
						register.tr_id2 = null;
						$("#valor").val("");
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
	
	function verifyValues(){
		event.preventDefault();
		$.post("./cor-exists", {motorista: register.motorista, passageiro: register.passageiro})
		.done(function( data ) {
			  if(data == null || data == "undefined"){
				  createMot();
			  }else{
					bootbox.dialog({
					title: 'Corrida com o mesmo Motorista e Passageiro',
					message: "Você tem certeza que deseja registrar outra corrida com estes dados?",
					centerVertical: true,
						buttons: {
							ok: {
								label: ' SIM ',
								className: 'btn btn-outline-info',
								callback: function(){
									createMot();
								}
							},
							cancel: {
								label: 'NÃO',
								className: 'btn btn-outline-secondary'
							}
						},
					});
			  }
		});
		$("html, body").animate({ scrollTop: 0 }, "slow");
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
		$.post("./crt-cor", { 
			motorista: register.motorista, 
			passageiro: register.passageiro, 
			valor: $("#valor").val()
		}).done(function(){
			hideAllMsgs();
			$("#msg-s").fadeIn();
			$("#consultar-div").hide();
			updT = true;
			setTimeout(function(){hideAllMsgs(true);}, 9000);
			
		});
		$("#loading").fadeOut();
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
						hideAllMsgs();
						$("#loading").fadeIn();
						$.post("./del-cor", {_id: $(id).attr("name")}).done(function(data){
							idtf = "";
							$("#msg-s3").fadeIn();
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
		$.post("./get-all-cor")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  
			  }else{
				    $("#table-motoristas").empty();
					data.forEach(
						function(data){
						var mot = JSON.parse(data.motorista);
						var pas = JSON.parse(data.passageiro);
						$("#table-motoristas").append("<tr>"+
							"<td><div style='width:42px; float: left; text-align: center'><i class='fas fa-car'></i></div>"+mot.nome+
							"</br><div style='width:42px; float: left; text-align: center'><i class='fas fa-male'></i></div>"+pas.nome+"</td>"+
							"<td style='text-align: center;'>"+mot.dt_nasc+"</br>"+pas.dt_nasc+"</td>"+
							"<td style='text-align: center;'>"+mot.cpf+"</br>"+pas.cpf+"</td>"+
							"<td style='text-align: center;'>"+mot.sexo+"</br>"+pas.sexo+"</td>"+
							"<td style='text-align: center;'>"+data.valor+"</td>"+
							"<td align='center' style='min-width: 40px;'><a onclick='excluirMot(this)' name='"+data._id+"'><i class='fas fa-trash' style='color: #d22e2e;'></i></a>"+"</tr>"
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
		});
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#loading").fadeOut();
	}
	
	function setMot(id){
		register.motorista = $(id).attr("name");
		if(motCh){
			$(id).css("background-color", "white");
			$(id).css("color", "#215c7d");
			var value = $("#search-cor1").val().toLowerCase();
			$("#table-motoristas-cor tr").filter(function() {
			  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
			});
			$("#search-cor1").slideDown();
			return motCh = false;
		}
		$("#search-cor1").val($(id).attr("alt"));
		$(id).css("background-color", "#4fc892");
		$(id).css("color", "white");
		var value = $("#search-cor1").val().toLowerCase();
		$("#table-motoristas-cor tr").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
		$("#search-cor1").slideUp();
		register.tr_id1 = id;
		motCh = true;
	}
	
	function setPas(id){
		register.passageiro = $(id).attr("name");
		if(pasCh){
			$(id).css("background-color", "white");
			$(id).css("color", "#215c7d");
			var value = $("#search-cor1").val().toLowerCase();
			$("#table-motoristas-cor tr").filter(function() {
			  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
			});
			$("#search-cor2").slideDown();
			return pasCh = false;
		}
		$("#search-cor2").val($(id).attr("alt"));
		$(id).css("background-color", "#4fc892");
		$(id).css("color", "white");
		var value = $("#search-cor2").val().toLowerCase();
		$("#table-motoristas-pas tr").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
		$("#search-cor2").slideUp();
		register.tr_id2 = id;
		pasCh = true;
	}
	
	function getAllMotCor(){
		$.post("./get-all-mot-a")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  
			  }else{
				    $("#table-motoristas-cor").empty();
					data.forEach(
						function(data){
						$("#table-motoristas-cor").append("<tr onclick='setMot(this)' alt='"+data.cpf+"' name='"+JSON.stringify(data)+"'>"+
							"<td align='center' style='min-width: 42px;'>"+
							"<a width='100%'><i class='fas fa-check' style='color: #dfdddd;'></i></a>"+
							"</td>"+
							"<td>"+data.nome+"</td>"+
							"<td align='center'>"+data.cpf+"</td>"+
							"<td style='min-width: 200px;'>"+data.mod_carro+"</td>"+
							"<td align='center'>"+data.sexo+"</td></tr>"
							);
						}
					);
					$("#consultar-div").fadeIn(600);
					$('.nav-tabs a[href="#cadastrar-div"]').removeClass('disabled');
			  }
		});
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#loading").fadeOut();
	}
	
	function getAllPasCor(){
		$.post("./get-all-pas")
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  
			  }else{
				    $("#table-motoristas-pas").empty();
					data.forEach(
						function(data){
						$("#table-motoristas-pas").append("<tr onclick='setPas(this)' alt='"+data.cpf+"' name='"+JSON.stringify(data)+"'>"+
							"<td align='center' style='min-width: 42px;'>"+
							"<a width='100%'><i class='fas fa-check' style='color: #dfdddd;'></i></a>"+
							"</td>"+
							"<td>"+data.nome+"</td>"+
							"<td align='center'>"+data.cpf+"</td>"+
							"<td align='center'>"+data.sexo+"</td></tr>"
							);
						}
					);
					$("#consultar-div").fadeIn(600);
					$('.nav-tabs a[href="#cadastrar-div"]').removeClass('disabled');
			  }
		});
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#loading").fadeOut();
	}
	
	$(document).ready(function(){
	  $("#search-cor1").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$("#table-motoristas-cor tr").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	  });
	});
	
	$("#loading").fadeIn();
	getAllMot();
	getAllMotCor();
	getAllPasCor();
	