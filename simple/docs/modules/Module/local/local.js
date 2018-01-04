Module("Module/local", function(require, exports, module){
////////

exports.local = function(id, base){
	base.localID = this.id + "::" + id;
	const data = localStorage.getItem(base.localID);
	if (data){
		base.set(data);
	}

	base.save(id);
};

exports.save = function(obj){
	if (!obj.localID || !obj.json){
		throw "oops";
	}

	localStorage.setItem(obj.localID, obj.json());
};

}); // end 
