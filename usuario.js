module.exports = {
	get: function(dados, dispatcher) {
		console.log('get...');
		dispatcher(JSON.stringify({"msg": "GET executado..."}));
	},
	post: function(ctx, dados, dispatcher) {			
		// trata os dados enviados
		ctx.validaUsuario(dados);
		console.log('dados', dados);

		dispatcher(JSON.stringify({"msg": "POST executado..."}));
	},
	put: function(dados, dispatcher) {
		console.log('put...');
		dispatcher(JSON.stringify({"msg": "PUT executado..."}));
	},
	delete: function(dados, dispatcher) {
		console.log('delete...');
		dispatcher(JSON.stringify({"msg": "DELETE executado..."}));
	},
	indisponivel: function(dados, dispatcher) {
		dispatcher(JSON.stringify({"err": "indisponivel..."}), 503);	
	}, 
	validaUsuario: function(dados) {
		// os dados do usuário devem vir em um objeto
		// como no modelo {nome, login}
		if (typeof dados !== 'object') {
			console.log('nao e obj');
			return false;
		} else if (dados.nome === undefined || dados.nome === '') {
			console.log('nome');
			return false;
		} else if (!/[0-9]{2}[a-z]{6}/g.test(dados.login)) {
			console.log('login');
			return false;
		}

		console.log('validaUsuario');
		return true;
	}
};