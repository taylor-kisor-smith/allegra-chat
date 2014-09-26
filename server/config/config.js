
var config = {
	//connectionString: "mongodb://chatter:chat123!@kahana.mongohq.com:10026/allegra-chat_prod"
	connectionString: "mongodb://chatter:chatter@kahana.mongohq.com:10032/allegra-chat_stage",
	
	routes: {
		prefix: '/allegra-chat/chat'
	}
};

module.exports = config;