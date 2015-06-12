var http = require('http');
var url = require('url');
var qs = require('querystring');
var async = require('async');
var usuario = require('./usuario');

// cria servidor HTTP
http.createServer(function(req, res) {

	// função responsável por montar resposta para cliente
 	var dispatcher = function(data, codHttp) { 	
 		// se codHttp não for informado ou se o valor
 		// for diferente de 2xx, 3xx, 4xx e 5xx
 		// define como código 200
 		if (codHttp === undefined || !/[2-5]{1}[0-9]{2}/g.test(codHttp)) {
 			codHttp = 200;
 		}

 		// verifica se foi enviado um objeto e converte para
 		// string
 		if (typeof data === 'object') {
 			data = JSON.stringify(data);
 		}

		res.writeHead(codHttp, {'Content-Type': 'application/json'});
		res.write(data);
		res.end();
	}

	
	// recupera método da requisição 
	// GET, POST, DELETE e PUT (tem outros que não usarei...)
	var metodo = req.method;

	// recupera url (vou chamar de recurso) para composição da rota (url + método)
	var dadosUrl = url.parse(req.url);	
	var recurso = dadosUrl.pathname;

	if (recurso === '/') {
		// raiz
		dispatcher('api disponível em /usuario', 202);
	} else if (recurso === '/usuario') {
		// recurso /usuario
		// verifica qual método foi enviado
		if (metodo === 'GET') {
			console.log('get');
			usuario.get(req, dispatcher);			
		} else if (metodo === 'POST') {
			getDados(req, dispatcher, usuario.post);			
		} else if (metodo === 'PUT') {
			usuario.put(req, dispatcher);
		} else if (metodo === 'DELETE') {
			usuario.delete(req, dispatcher);
		} else {
			usuario.indisponivel(dispatcher);
		}
	} else {
		console.log(recurso);
		dispatcher('not found', 404);
	}



}).listen(3000, function() {
	console.log('rodando...');
});

var getDados = function(req, dispatcher, callback) {
	req.setEncoding('utf8');
	var bodyString = '';
	var objReq = {};
	req.on('data', function(data) {
		bodyString += data;
	}).on('end', function() {	
		var body = qs.parse(bodyString);					
		for (var key in body) {
			objReq[key] = body[key];
		}
		objReq = body;
	});

	callback(usuario, objReq, dispatcher);
}
