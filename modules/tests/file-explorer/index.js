Module("tests/file-explorer/index.js", 
	[], function(require, exports, module){

server.addEventListener("open", function(){
	server.send(JSON.stringify({
		action: "file-explorer"
	}));
});

var files;
const filesUI = View();
const fileViews = {};

const FileView = View.extend({
	render(){
		this.append({
			fileName: this.file,
			fileContents: View({
				tag: "textarea",
				render(){
					this.el.addEventListener("input", ()=>{
						server.obj({
							action: "file-explorer",
							file: this.parent.file,
							data: this.el.value
						});
					});
				}
			})
		});

		this.click(() => {
			if (!this.loaded)
				server.obj({ action: "file-explorer", file: this.file });
		});

		fileViews[this.file] = this;
	},
	data(data){}
});


server.addEventListener("message", function(e){
	const data = JSON.parse(e.data);
	if (data.action === "file-explorer"){
		console.log("file-explorer data", data);
		if (data.file && fileViews[data.file]){
			fileViews[data.file].fileContents.set(data.data);
			fileViews[data.file].loaded= true;
		} else {
			files = data.data;
			filesUI.append(files.map(f => FileView({ file: f })));
		}
	}
});

document.then(() => filesUI.appendTo(document.body));


});