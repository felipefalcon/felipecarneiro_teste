
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
		$('.nav-tabs a[href="#editar-div"]').removeClass('disabled');
		$('.nav-tabs a[href="#editar-div"]').tab('show');
		$('.nav-tabs a[href="#editar-div"]').addClass('disabled');
		$('.nav-tabs a[href="#editar-div"]').addClass('attcolor');
		//alert($(id).attr("name"));
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