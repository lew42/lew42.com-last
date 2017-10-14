define("Server", ["Base2"], function(Base2){

	var Server = Base2.extend({
		instantiate: function(){
			this.constructs.apply(this, arguments);
			this.initialize();
		},
		constructs: function(o){
			if (o && is.def(o.log)){
				if (o.log){
					this.log = this.log.on;
				} else {
					this.log = this.log.off;
				}
			}
		},
		initialize: function(){
			this.socket = new WebSocket("ws://" + window.location.host);

			this.socket.addEventListener("open", function(){
				this.log("server.socket connected");
			}.bind(this));

			this.socket.addEventListener("message", function(e){
				if (e.data === "reload"){
					window.location.reload();
				} else {
					this.log("message from server.socket", e);
				}
			}.bind(this));
		}
	});

	window.server = new Server({ log: true });

	return Server;
})