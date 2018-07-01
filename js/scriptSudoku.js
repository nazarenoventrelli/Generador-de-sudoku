
window.onload = function() {

$.blockUI({ message: '<img src="img/cargando.gif"/>' , css: { 
               border:'none',
            	top:'30%',
            	left:'30%',

             } 
             });

	function numeroAleatorio(limite){

	return Math.round (Math.random() * (limite - 1) + 1);
	};
	//------------------------------------------------------
	//Inicializacion
	//crea array de n dimensiones leyendo longitud de un input
	//se asigna a todas las celdas un valor aleatorio
	//------------------------------------------------------
	var longitud = 9;
	var celdas;
	var celdaSeleccionada;
	var ayudaHabilitada=true;
	var ultimosMov = new Array();
	var celdasCompletadas=0;
	var dificultad;
	var contenedorJuego;
	var semilla;
	var solucion;
	var dificultadElegida;
	var aCompletar;
	var estadoJuegoAnt;

	var contenedorPrincipal=document.querySelector(".contenedor");
	var valoresPosibles=document.getElementById("valoresPosibles");
	var btn_empezar = document.getElementById("btn_empezar");
	var btn_ayuda = document.getElementById("btn_ayuda");
	var btn_deshacer = document.getElementById("btn_deshacer");
	var opcionDificultad = document.querySelector("select");
	var mensajeAlerta = document.getElementById("msjeAlerta");
	var contenedorAlerta = document.getElementById("contenedorAlerta");
	var barraProgreso = document.getElementById("bar");
	var labelProgreso = document.getElementById("porcentajeCompletado")
	var btn_ganar = document.getElementById("btn_ganar");
	var select = document.querySelector("select");
	var m = constructorMatriz();


	btn_empezar.onclick=juegoNuevo;
	btn_ayuda.onclick=ayuda;
	btn_deshacer.onclick=deshacerMovimiento;
	btn_ganar.onclick=ganar;
	select.onchange=notificarDificultad;
	crearGrilla();

	semilla = crearSemilla();

	function ganar(){
		

		//copia la solucion a la matriz m
		m = JSON.parse(JSON.stringify(solucion));
		
		celdasCompletadas=aCompletar;

		mostrarProgreso(true);
		llenarCeldas();

		generarMensaje("Juego completado!","rojo");

	}

	function deshacerMovimiento() {
		if (ultimosMov.length>0){
			
			
			var valor = ultimosMov.pop();
			var celda=document.getElementById(valor);

			if (celda.value==""){
				deshacerMovimiento();
			}

			generarMensaje("Movimiento eliminado","amarillo");
			asignarValor(valor,"");
		}else{
			generarMensaje("No hay movimientos que borrar","rojo");
		}

	}

	function ayuda(){
		
		ayudaHabilitada =! ayudaHabilitada;

		if (ayudaHabilitada){

			btn_ayuda.value="Deshabilitar Ayuda";
   	 		generarMensaje("Ayuda Habilitada","azul");
   	 		
   	 	}else{

   	 		btn_ayuda.value="Habilitar Ayuda";

   	 		generarMensaje("Ayuda Desabilitada","azul");

   	 	}

   	 	

	}
	function notificarDificultad(){
		var opcionElegida = select[select.value-1].text;

		opcionElegida = "Dificultad " + opcionElegida + " elegida";

		generarMensaje(opcionElegida,"amarillo");
	}
	function generarMensaje(texto,color){
		//elimina cualquier clase previa
		contenedorAlerta.classList.remove("alert-info","alert-danger","alert-success","alert-warning");

		//setea el texto de mensaje
		mensajeAlerta.innerText=texto;

		//añade al contenedor la correspondiente clase
		switch(color){
			case "rojo":
				contenedorAlerta.classList.add("alert-danger");
			break;

			case "azul":
				contenedorAlerta.classList.add("alert-info");
			break;

			case "verde":
				contenedorAlerta.classList.add("alert-success");
			break;
			case "amarillo":
				contenedorAlerta.classList.add("alert-warning");
			break;

		}


		mostrarAlerta();
	}

	function mostrarAlerta(){

		//para las animaciones setea la opacidad en 1
		$(".alert").stop().css({ opacity: 1,display:'block' });
	
		//muestra el alerta y resetea sus atributos para poder volverla a mostrar
		$(".alert").stop().fadeTo(1000, 1).slideUp(1000).removeAttr('style');

	}


	function opcionesCelda(i,j){
		//opcionesCelda devuelve un valor valido o un none en caso contrario

		if (ayudaHabilitada){

			var posibles = new Array(9);
			var valores = [];
			var valorInicial = m[i][j];
			posibles.fill(false);
			
			valor = 0;

			posibles.forEach(function(valorAct,ind,array){
					
				m[i][j]=parseInt(ind+1);
				posibles[ind] = celdaValida(i,j);
			
				if (posibles[ind]){
					valor = m[i][j];
						 
					if (valor != valorInicial){
						valores.push(valor);
				
					}
				
				}

			})
		
			m[i][j]=valorInicial;

		}
		
		return valores;
	}

	function numeroValido(i,j){
		//asigna un valor valido en la matriz m y devuelve true
		// o uno aleatorio y devuelve false

		var posibles = opcionesCelda(i,j);
		var result;
		var valorAleato;

		if (posibles.length>0){

			valorAleato = numeroAleatorio(posibles.length)-1;
			
			m[i][j]=posibles[valorAleato];
			
			result=true;
		}else{

			m[i][j]=numeroAleatorio(9);
			
			result=false;
		}

	
		return result;
	}

/*
		<div class="row" id="contenedorPrincipal">
			<a data-fancybox="gallery" id="imgGaleria" href="img/default.jpg"><img id="imagen" src="img/default.jpg"></a>
		</div>
		*/
		
	function crearGrilla(){
		contenedorJuego = document.querySelector(".sudoku");
		var tabla = document.createElement("div");
		tabla.classList.add("contenedorTabla");
		
		var cont;
		var soloLectura;
		contenedorJuego.innerHTML="";
		
		cont = "<table border='1'>";

		for(var i =0;i<longitud;i++){

			cont =  cont + "<tr>";

			for(var j=0;j<longitud;j++){

				cont =  cont + "<td> <input type = 'text' onkeypress='return soloNumeros(event)' maxlength=1 class='celdas' id="+i+'-'+j+"> </td>";
				
		
			}
			cont =  cont + "</tr>";
		}
		cont =  cont + "</table>";
		tabla.innerHTML=cont;
		contenedorJuego.appendChild(tabla);
			
		 asignarCeldas();

		
	};

	function soloNumeros(e){
	    var keynum = window.event ? window.event.keyCode : e.which;
	
    	if (keynum == 48)
     		return false;

	    return /\d/.test(String.fromCharCode(keynum));
	}
	//------------------------------------------------------
	//Al modificar el valor de un input se almacena el valor en la variable m
	//------------------------------------------------------
	
	function asignarCeldas(){
		celdas = document.querySelectorAll(".contenedorTabla input");
		var id;
		celdas.forEach(function(valor,i,array){

			array[i].onchange=function(){ 
				id = array[i].id;
				ultimosMov.push(id);

				
				asignarValor(id,array[i].value);

			}


			array[i].onclick=function(){ 
				if ((array[i].getAttribute("readonly")) != "readonly"){

					seleccionarCelda(array[i].id);
				}else{
					valoresPosibles.innerText="";
				}
			}
		})
	};


	function seleccionarCelda(id){
		//titulo.innerHTML=id;
		celdaSeleccionada = id;

		id=dividirStr(id);

		var valores = opcionesCelda(id[0],id[1]);

		valoresPosibles.innerText = "";

		for (i in valores){
			if (valoresPosibles.innerText == ""){
				valoresPosibles.innerText = valoresPosibles.innerText + valores[i];
			}else{
				valoresPosibles.innerText = valoresPosibles.innerText + "-" +valores[i];
			}
		}


	}
	function dividirStr(str){
		var res;

		res = str.split("-");
		
		

		res[0] = parseInt(res[0]);
		res[1] = parseInt(res[1]);

		return res;
	}
	
	function asignarValor(id,valor){
		var i,j;
		var celda=document.getElementById(id);

		// asigna el valor a la celda visible y la matriz

		id = dividirStr(id);

		i = id[0];
		j = id[1];
	
		

			if ( isNaN(valor) || (valor == "") ){

				if ( (celdasCompletadas>0) && ( celdaValida(i,j) ) ){
					celdasCompletadas--;
				}

				celda.value="";
				m[i][j] = parseInt(valor);
			}else{

				m[i][j] = parseInt(valor);
				console.log("menos de 35 "+ (celdasCompletadas<aCompletar) );
				console.log("valida" +celdaValida(i,j));
				if ( (celdasCompletadas<aCompletar) && (celdaValida(i,j) ) ){
					console.log("suma");
					celdasCompletadas++;
				}else{
					console.log("entro al else")
					
				}

			celda.value=m[i][j];
		}

		
	
		console.log("completadas: "+celdasCompletadas);
		mostrarProgreso(false);

	}


	//------------------------------------------------------
	//Se comprueba que las celdas cumplan las 3 condiciones del juego
	//-columnaValida
	//-filaValida
	//-cuboValido
	//------------------------------------------------------


	function juegoCompletado(){
		var i=0;
		var j=0;

		var valido=true;

		var estado="";
		
			while ( (i<longitud) && valido){
				while( (j<longitud) && valido){
					valido=celdaValida(i,j);
					j++;
				}
				j=0;
				i++;
			}


		if (valido){
			if ((celdasCompletadas == 81) || (celdasCompletadas==aCompletar)){
			
				estado="completado";
			}else{
			
				estado="valido";
			}
		}else{
			estado="no valido";
		}


		return estado;
	}
	function celdaValida(i,j){
	
		return (columnaValida(j) && filaValida(i) && cuboValido(i,j));
	}	

	function columnaValida(numCol){
		var result=true;
		var temp = new Array(longitud);
		var valorAct;
		var i=-1;

		while (result && (i<longitud-1) ){
			i++;

			valorAct = m[i][numCol];


			if (!isNaN(valorAct) && (valorAct!="")){

				if ( temp[valorAct] != -1 ){
						
					temp[valorAct] = -1;

				}else{
							
					result=false;
				}
		
			}
		}

		return result;

	}

	function filaValida(numFila){
		var result=true;
		var temp = new Array(longitud);
		var valorAct;
		var j=-1;
		while (result && (j<longitud-1) ){
			j++;

			valorAct = m[numFila][j];
			if (!isNaN(valorAct) && (valorAct!="")){
				if ( temp[valorAct] != -1 ){
					temp[valorAct] = -1;

				}else{

					result=false;
				}
		
			}
		}

		return result;

	};

	function cuboValido(posI,posJ){

		var result =true;
		var temp = new Array(longitud);
		var valorAct;
		var r = calcularRecorrido(posI,posJ);



		var i = r[0];
		var j;

		var maxI = i + 2;
		var maxJ = r[1] + 2;

		while ( result && ( i <= maxI ) ){
			

			j = r[1];
			while (result && ( j <= maxJ ) ){
				
				valorAct = m[i][j];
			
				
				if (!isNaN(valorAct) && (valorAct!="")){

					if ( temp[valorAct] != -1 ){
						temp[valorAct] = -1;
					}else{

						result=false;
					}
		
				}

				j++;
			}

			i++;

		}
		return result;
	}


	
	function calcularRecorrido(i,j){

		var r = new Array(2);
		
		//coordenada de cubo 3x3 (del 1 al 3)
		i = Math.round((i+2)/3);
		j = Math.round((j+2)/3);

		//coordenada inicial

		var minI=(i-1)*3;
		var minJ=(j-1)*3;

		r[0]=minI;
		r[1]=minJ;

		return r;
	}
	//------------------------------------------------------
	//A partir de un sudoku semilla se generan nuevos sudokus resueltos

	//------------------------------------------------------

	function inicializar(){
		m = constructorMatriz();
		ultimosMov = [];
		celdasCompletadas=0;
		mostrarProgreso(false);
	}

	function constructorMatriz(){
		//crea una matriz de 9x9 vacia

		var matriz = new Array();

		for (var i=0;i<longitud;i++){
			matriz[i] = new Array(longitud);
		}


		return matriz;
	}
	function desbloquear(){
		$.unblockUI();
		contenedorPrincipal.classList.remove("ocultar");
	}
    function crearSemilla(){
    	var temp=0,estado;
    	//genera un nuevo sudoku resuleto
		
    		estado=juegoCompletado();

	    	while ( (estado!="completado") && (temp<4000) ){
	    		inicializar();
				generarPosibilidad();
	    		estado=juegoCompletado();
	    		temp++;
	    	}

	   	if (temp>=4000){
	   		alert("Tiempo de espera superado, por favor recarga la pagina");
	   		m=undefined;
	   	}else{
    		setTimeout(desbloquear,1000);
	   	}
		
    	return m;
    }


	function generarPosibilidad(){

		var id;
		
			for(var i = 0;i<81;i++){

				id = dividirStr(celdas[i].id);

				celdasCompletadas++;
				
				numeroValido(id[0],id[1])
					
			}
	}

	function llenarCeldas(){
		//vuelca el valor de la matriz m en las celdas

		var posCelda;
		var valor;
		for (var i =0;i<longitud;i++){
			for(var j =0;j<longitud;j++){
				posCelda=(i*longitud)+j;
				valor = m[i][j];
				celdas[posCelda].value=m[i][j];

				if (valor !=""){
					celdas[posCelda].setAttribute("readonly","readonly");
					celdas[posCelda].classList.add("celdaCompleta");
				}else{
					celdas[posCelda].removeAttribute("readonly","readonly");
					celdas[posCelda].classList.remove("celdaCompleta");
				}


			}
		}
	}

	function juegoNuevo(){
	
		inicializar();
		
		m = varianteReemplazando();
		solucion = JSON.parse(JSON.stringify(m));
		//crea una copia por valor de m en solucion
		
	
		removerPosiciones();
		llenarCeldas();

		generarMensaje("Juego generado","verde");
	}

    function varianteReemplazando(){
    	//genera un nuevo sudoku resuelto alternando sus valores

    	var variante = constructorMatriz();
    
    	var valor;
    	var numAleato;
    	var valores = [1,2,3,4,5,6,7,8,9];
    	var permutaciones = new Array();
    	//crea un array de 9 posiciones con valores aleatorios distintos
    	//al indice

    	for(var k =0;k<longitud;k++){
    		
    		 numAleato=numeroAleatorio(valores.length)-1;
    		 valor=valores[numAleato];

    		 while ( (valor == k+1) && (k!=longitud-1) ){
    		 	numAleato=numeroAleatorio(valores.length)-1;
    			valor=valores[numAleato];
    		 }

    		 valores.splice(numAleato,1);

    		 permutaciones[k]=valor;

    	}

    	//reemplaza cada valor en la matriz por el correspondiente aleatorio en el array permutaciones
    	for(var i = 0;i<longitud;i++){
    		for(var j=0;j<longitud;j++){
    		
				variante[i][j]=permutaciones[semilla[i][j]-1];
    		}
    	}

    	return variante;
    }

    function esPar(num){

    	if ((num % 2)!=0){
    		result = false;	
    	}else{
    		result= true;
    	}

    	return result;
    }
    	function removerPosiciones(){
    		var dificultad = opcionDificultad.value;
    		dificultadElegida = dificultad;
    		var remover=0;

    		switch (dificultad) {
	    		case "1":
	    			remover=35;
	    			aCompletar=35;
	    		break;
	    		case "2":
	    			remover=45;
	    			aCompletar=45;
	    		break
	    		case "3":
	    			remover=49;
	    			aCompletar=49;
	    		break
	    		case "4":
	    			remover=53;
	    			aCompletar=53;
	    		break
	    		case "5":
	    			remover=64;
	    			aCompletar=64;
	    		break;

    		}

    		var i,j;
    		var temp=0;
 
    		while ( remover>0 && temp<999 ){

    			remover--;
    			temp++;

    				i = numeroAleatorio(9)-1;
    				j = numeroAleatorio(9)-1;

    				while ( m[i][j] == "" ) {

    					i = numeroAleatorio(9)-1;
    					j = numeroAleatorio(9)-1;
    				}
    				
    				m[i][j]= "";
    				

    		}
    	
    		
    	}
   		function solucionar(){
   			var id,valor;
   			for (var i=0;i<longitud;i++){
   				for(var j=0;j<longitud;j++){
   					id = i+"-"+j;
   					valor=solucion[i][j];
   					asignarValor(id,valor)
   				}

   			}
   			
   		}

    	function mostrarProgreso(mostrarSolucion){
    		var porcentaje;

    		var estadoDelJuego = juegoCompletado();
    		estadoJuegoAnt=estadoDelJuego;
    		//se inicializa el porcentaje con el valor anterior
			/*
			var porcentaje = barraProgreso.style.width.split("%");
			porcentaje=porcentaje[0];
			*/
			var porcentaje = Math.round((celdasCompletadas*100)/aCompletar);

			if (!mostrarSolucion){

				if ((estadoDelJuego == "valido")||(estadoDelJuego == "completado")){

						//calcula el porcentaje
						//porcentaje = Math.round((celdasCompletadas*100)/aCompletar);

			   	 		if  ( isNaN(porcentaje) || (porcentaje<0) ) {

			   	 			porcentaje=0;

			   	 		}


			   	 		barraProgreso.classList.remove("bg-danger");
   	 					barraProgreso.classList.add("bg-success");

   	 					if (estadoDelJuego == "completado"){
   	 						generarMensaje("Juego completado!","verde");
   	 					}

	   	 		}else{
	   	 		
	   	 				barraProgreso.classList.remove("bg-success");
	   	 				barraProgreso.classList.add("bg-danger");
	   	 		
	   	 		
	   	 		}

	   	 
	    	}else{
	    		porcentaje = 100;

	    		barraProgreso.classList.remove("bg-danger");
   	 			barraProgreso.classList.add("bg-success");
	    	
	    	}

			if   (porcentaje<0)  {

	   	 		porcentaje=0;
	   	 	}

    		barraProgreso.style.width= parseInt(porcentaje)+"%";
   	 		labelProgreso.innerText = "Porcentaje completado: "+porcentaje+" %";



}

};

