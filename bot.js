const Mail = require('./lib/Mail');
const TelegramBot = require(`node-telegram-bot-api`)
const TOKEN = '1033548131:AAH1kZEqYd7I7utqnPRUTdXskFhnEAE1NfY'
const bot = new TelegramBot(TOKEN, { polling: true })
const Promise = require('bluebird');

let email = '';
let phone = '';

// Comandos
const COMMAND_GRAAC = 'Conhecer mais sobre o GRAACC';
const COMMAND_VISITA = 'Agendar uma visita ao Hospital GRAACC';
const COMMAND_DOACAO = 'Como realizar uma doação?'
const COMMAND_VOLTAR_INICIO = 'Opções Anteriores';
const COMMAND_BREVE_HISTORIA = 'Breve história do GRAACC'
const COMMAND_NUMEROS_ALCANCADOS = 'Números alcançados'
const COMMAND_ESTRUTURA = 'Estrutura Hospitalar'
const COMMAND_CONFIRMA_INTERESSE = 'Tenho interesse.'
const COMMAND_NAO_OBRIGADO = 'Não, obrigado.'
const COMMAND_ENVIO_EMAIL = 'Email';
const COMMAND_ENVIO_TELEFONE = 'Telefone';
const COMMAND_ENCERRAR = 'Encerrar atendimento.'
const COMMAND_ACOMPANHAR = 'Veja os resultados de uma boa ação'

// Textos
const texto_graac = 'O GRAACC é uma instituição social sem fins lucrativos que nasceu para garantir a crianças e adolescentes com câncer, dentro do mais avançado padrão científico, o direito de alcançar todas as chances de cura com qualidade de vida.\n\nPoderia lhe contar uma breve História sobre a fundação da instituição.        Também posso apresentar um rápido Relatório a respeito dos números que alcançamos.                                            Ou, se preferir, lhe entregar uma breve introdução quanto a estrutura de nosso hospital. Você escolhe...'
const texto_doar = 'Para doar através de uma plataforma segura e com um valor a sua escolha, acesse: https://pag.ae/bjcTNTc\n\n\nCaso você possua uma conta no PayPal, pode optar por fazer uma doação através deste link:\nhttps://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R34LE62LS54XW&source=url\n\n\nAlém da contribuição em dinheiro, existem outros meios de sua ajuda nos alcançar, como, por exemplo, através de trabalho voluntariado e doações de cabelo. Para mais informações sobre esses ou outros meios de doar, acesse: https://graacc.org.br/doar/#'
const texto_agradecimento_doacao = 'Obrigado por sua contribuição!\nFicamos extremamente gratos por cada simpatizante, seu apoio é fundamental para dar continuidade a nossa ação.'
const texto_visita = 'As visitas acontecem durante a semana e aos sábados. Entretanto, não é possível interagir com os pacientes, nem fotografar ou filmar.'
const texto_breve_historia = 'O GRAACC nasceu em 1991 e foi instituído com a parceria de três Fundadores, estes são: \n1 - Lea Della Casa Mingione, que já dedicava sua vida ao voluntariado 20 anos antes do GRAACC criar forma;\n2 - Jacinto Guidolin, graduado em engenharia civil pela Escola de Engenharia da Universidade Mackenzie;\n3 - Dr. Antonio Sérgio Petrilli, formado em Medicina pela Universidade Estadual de Campinas UNICAMP, é superintendente médico do GRAACC.'
const texto_numeros_alcancados = 'Em 2018, alcançamos uma marca com mais de 4.200 pacientes atendidos, contribuímos para a medicina brasileira oferecendo espaço para 30 Residentes Multiprofissionais e registramos mais de 10 Pesquisas Científicas.\nNo período de janeiro a outubro, ultrapassamos o número de 29.000 Consultas Médicas, mais de 19.000 Quimioterapias e um pouco mais de 1.200 cirurgias já foram realizadas. E tudo é só a ponta do Iceberg.'
const texto_extrutura_hospitalar = 'Para combater o câncer infantil, desde 1998, o GRAACC possui um hospital que, em parceria técnica-científica com a Universidade Federal de São Paulo (UNIFESP), é referência no tratamento da doença, principalmente nos casos de maior complexidade e alcançando altos índices de cura.'
const texto_inserir_email = 'Para reservar uma visita em seu nome, alguns dados são necessários. Por favor, insira seu e-mail:'
const texto_inserir_numero = 'Qual o seu número de celular? Exemplo: 11912345678'
const texto_visita_confirmada = 'Seus dados foram enviados e sua visita será agendada. Aguarde contato do GRAACC confirmando dias e horários disponíveis. Agradecemos o seu interesse em conhecer mais sobre nossa ação e esperamos que visita sirva de inspiração. Muito obrigado, e nos vemos em breve!'
const texto_encerrar = 'O GRAACC agradece o seu contato. Divulgue este canal para que mais pessoas conheçam, acompanhem e apoiem a causa que abraçamos.'
const texto_adeus = 'Qualquer coisa que precisar estaremos por aqui. Tchau e não se esqueça da gente.';

// Estrutura de decisão do chatbot baseado no input do usuário
// Cada comando entra em um ramo diferente da árvore
bot.on('message', (msg) => {
	if (isEmail(msg.text)) {
		email = msg.text;
		msg.text = COMMAND_ENVIO_EMAIL;
	} else if (isTelefone(msg.text)) {
		phone = msg.text;
		msg.text = COMMAND_ENVIO_TELEFONE;
	}

	switch (msg.text) {
		case COMMAND_GRAAC:
			conhecerGraacc(msg);
			break;
		case COMMAND_DOACAO:
			bot.sendMessage(msg.chat.id, texto_doar).then(
				bot.sendMessage(msg.chat.id, "Ainda podemos ajudar em mais alguma coisa ?", {
					"reply_markup": {
						"keyboard": [[COMMAND_GRAAC], [COMMAND_DOACAO], [COMMAND_VISITA], [COMMAND_ACOMPANHAR], [COMMAND_ENCERRAR]]
					}
				})
			);
			break;
		case COMMAND_VISITA:
			agendarVisita(msg);
			break;
		case COMMAND_BREVE_HISTORIA:
			bot.sendMessage(msg.chat.id, texto_breve_historia);
			break;
		case COMMAND_NUMEROS_ALCANCADOS:
			bot.sendMessage(msg.chat.id, texto_numeros_alcancados);
			break;
		case COMMAND_ESTRUTURA:
			bot.sendMessage(msg.chat.id, texto_extrutura_hospitalar).then(
				bot.sendMessage(msg.chat.id, "https://www.youtube.com/watch?v=8k328erJ0xQ"));
			break;
		case COMMAND_CONFIRMA_INTERESSE:
			confirmarInteresseVisita(msg);
			break;
		case COMMAND_ENVIO_EMAIL:
			enviarEmail(msg);
			break;
		case COMMAND_ACOMPANHAR:
			var photoDir = __dirname + '/' + Math.floor((Math.random() * 5) + 1) + '.jpg';
			bot.sendPhoto(msg.chat.id, photoDir);
			break;
		case COMMAND_ENVIO_TELEFONE:
			enviarTelefone(msg, phone, email);
			break;
		case COMMAND_ENCERRAR:
			bot.sendMessage(msg.chat.id, texto_encerrar).then(bot.sendMessage(msg.chat.id, texto_adeus, {
				"reply_markup": JSON.stringify({
					hide_keyboard: true
				})
			}))
			break;
		case COMMAND_NAO_OBRIGADO:
		case COMMAND_VOLTAR_INICIO:
			bot.sendMessage(msg.chat.id, "Como você pode nos ajudar hoje?", {
				"reply_markup": {
					"keyboard": [[COMMAND_GRAAC], [COMMAND_DOACAO], [COMMAND_VISITA], [COMMAND_ACOMPANHAR]]
				}
			});
			break;
		default:
			if (!msg.text.includes('start')) {
				bot.sendMessage(msg.chat.id, 'Não entendi, pode tentar de novo?');
			} else {
				bot.sendChatAction(msg.chat.id, "typing").then(
					bot.sendMessage(msg.chat.id, "Olá, <b>" + msg.from.first_name + "</b>, Bem Vindo ao GRAACC.", { parse_mode: "HTML" }).then(
						bot.sendMessage(msg.chat.id, "Como você pode nos ajudar hoje?", {
							"reply_markup": {
								"keyboard": [[COMMAND_GRAAC], [COMMAND_DOACAO], [COMMAND_VISITA], [COMMAND_ACOMPANHAR]]
							}
						})
					)
				)
			}
	}
})

function conhecerGraacc(msg) {
	bot.sendMessage(msg.chat.id, texto_graac, {
		"reply_markup": {
			"keyboard": [[COMMAND_BREVE_HISTORIA], [COMMAND_NUMEROS_ALCANCADOS], [COMMAND_ESTRUTURA], [COMMAND_VOLTAR_INICIO]]
		}
	})
}

function agendarVisita(msg) {
	bot.sendMessage(msg.chat.id, texto_visita, {
		"reply_markup": {
			"keyboard": [[COMMAND_CONFIRMA_INTERESSE], [COMMAND_NAO_OBRIGADO]]
		}
	})
}

function confirmarInteresseVisita(msg) {
	bot.sendChatAction(msg.chat.id, "typing");
	bot.sendMessage(msg.chat.id, texto_inserir_email, {
		parse_mode: "HTML"
	});
}

// Função para validação de email baseada na RFC822 (https://www.ietf.org/rfc/rfc0822.txt?number=822)
// Simplificação da função disponível em http://www.ex-parrot.com/~pdw/Mail-RFC822-Address.html
function isEmail(text) {
	if (text.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi)) {
		return true;
	}
	return false;
}

// A função abaixo demonstra o uso de uma expressão regular que identifica, de forma simples, telefones válidos no Brasil.
// Nenhum DDD iniciado por 0 é aceito, e nenhum número de telefone pode iniciar com 0 ou 1.
// Exemplos válidos: +55 (11) 98888-8888 / 9999-9999 / 21 98888-8888 / 5511988888888
function isTelefone(text) {
	if (text.match(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/)) {
		return true;
	}
	return false;
}

function enviarEmail(msg) {
	bot.sendChatAction(msg.chat.id, "typing");
	bot.sendMessage(msg.chat.id, texto_inserir_numero, {
		parse_mode: "HTML"
	});

}


function enviarTelefone(msg, phone, email) {
	// Função para disparar email usando o nodemailer
	// Necessário alterar parâmetros para código em produção
	Mail.sendMail({
		from: email,
		to: "wallyson.galvao@gmail.com",
		subject: "GRAACC - Visita",
		text: "Novo agenamento",
		template: "visitor",
		context: {
			visitor: `${msg.from.first_name} ${msg.from.last_name}`,
			phone,
			email
		}
	}).then(
		bot.sendMessage(msg.chat.id, texto_visita_confirmada, {
			parse_mode: "HTML"
		}).then(
			bot.sendMessage(msg.chat.id, "Ainda podemos ajudar você em mais alguma coisa ?", {
				"reply_markup": {
					"keyboard": [[COMMAND_GRAAC], [COMMAND_DOACAO], [COMMAND_VISITA], [COMMAND_ACOMPANHAR], [COMMAND_ENCERRAR]]
				}
			})
		)
	);
}

Promise.config({
	cancellation: true
})