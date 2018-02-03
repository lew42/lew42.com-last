define("Module/local", function(require, exports, module){
////////

module.exports = function(id, base){
	base.localID = this.id + "::" + id;
	var data = localStorage.getItem(base.localID);
	if (data){
		console.log("loaded", data);
		data = JSON.parse(data);
		console.log("parsed", data);
		// base.load(data);
		base.set(data);
	} else {
		base.save();
	}

	// base.save(id);
	return base;
};

// exports.save = function(obj){
// 	if (!obj.localID || !obj.json){
// 		throw "oops";
// 	}

// 	localStorage.setItem(obj.localID, obj.json());
// };

}); // end 
