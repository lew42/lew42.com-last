Module("Drag", [], function(require, exports, module){
////////

const styles = View({tag: "link"})
	.attr("rel", "stylesheet")
	.attr("href", "/modules/Drag/Drag.css")
	.appendTo(document.head);

const DragView = module.exports = View.extend("DragView", {
	render(){
		this.append("drag");

		this.el.addEventListener("mousedown", () => {
			this.start();
		});
	},
	start(){
		this.addClass("dragging");
		this.listen();
	},
	listen(){
		var count = 0;
		const cb = (e) => {
			console.log(e);
		};
		document.addEventListener("mousemove", cb);
		document.addEventListener("mouseup", () => {
			document.removeEventListener("mousemove", cb);
		});
	},
	stop(){
		this.removeClass("dragging");
	}
});

const Drag = Base.extend("Drag", {
	start(){
		this.dragging = true;
		console.log("dragging = true");
		this.emit("start");
	}
});

}); // end 