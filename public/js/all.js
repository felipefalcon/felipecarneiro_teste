
	$("#limpar-campos1").click(function(){
		if(confirm("Tem certeza que deseja limpar todos os campos?")){
			$("#nome").val("");
			$("#data-n").val("");
			$("#cpf").val("");
			$("#modelo-c").val("");
			$("#msg-e").hide();
			$("#msg-s").hide();
		}
	});
	
	function verifyMotExists(){
		event.preventDefault();
		$.post("./mot-exists", {cpf: $("#cpf").val()})
		  .done(function( data ) {
			  if(data == null || data == "undefined"){
				  createMot();
			  }else{
				  $("#msg-s").hide();
				  $("#msg-e").fadeIn();
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
			$("#msg-e").hide();
			$("#msg-s").fadeIn();
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
		//alert($(id).attr("name"));
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
				$("#loading").fadeOut();
		});
	}
	
	function excluirMot(id){
		alert($(id).attr("name"));
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
							"<td>"+data.dt_nasc+"</td>"+
							"<td>"+data.cpf+"</td>"+
							"<td>"+data.mod_carro+"</td>"+
							"<td>"+data.status+"</td>"+
							"<td>"+data.sexo+"</td>"+
							"<td align='center'><a onclick='editarMot(this)' name='"+data._id+"'><i class='fas fa-pen' style='color: #215c7d;'></i></a>"+
							"<a style='margin-left: 32px;' onclick='excluirMot(this)' name='"+data._id+"'><i class='fas fa-trash' style='color: #d22e2e;'></i></a>"+
							"</td>"+"</tr>"
							);
						}
					);
					$("#table-motoristas").append("</br></br>");
					$("#consultar-div").fadeIn(600);
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