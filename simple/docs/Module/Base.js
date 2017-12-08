const createConstructor = function(name){
	eval("var " + name + ";");
	var constructor = eval("(" + name + " = function(...constructs){\r\n\
		if (!(this instanceof " + name + "))\r\n\
			return new " + name + "(...constructs);\r\n\
		return this.instantiate(...constructs);\r\n\
	});");
	return constructor;
};

const Base = window.Base = function(...constructs){
	if (!(this instanceof Base))
		return new Base(...constructs);
	return this.instantiate(...constructs);
};

Base.assign = Base.prototype.assign = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		for (var prop in arg){
			this[prop] = arg[prop];
		}
	}
	return this;
};

Base.prototype.instantiate = function(){};
Base.prototype.set = set;
Base.prototype.log = logger(false);
Base.prototype.set_log = function(value){
	this.log = logger(value);
};

Base.extend_args = function(first){
	var name, args;
	if (typeof first === "string"){
		name = first;
		args = [].slice.call(arguments, 1);
	} else if (first && first.name){
		name = first.name;
		delete first.name;
		args = arguments;
	} // otherwise, leave name undefined, for now

	return {
		name: name,
		args: args
	};
};

Base.createConstructor = createConstructor;
Base.extend = function(...args){
	const params = this.extend_args(...args);
	const Ext = this.createConstructor(params.name || this.name + "Ext");
	Ext.assign = this.assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.set.apply(Ext.prototype, params.args); // strips the name out

	return Ext;
};