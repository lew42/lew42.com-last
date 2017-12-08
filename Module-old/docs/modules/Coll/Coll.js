Module("Coll", function(){
	const Item = Base.extend({
		name: "Item",
		instantiate(...args){
			this.set(...args);
		}
	});

	const Coll = Base.extend({
		name: "Coll",
		instantiate(){
			this.items = { length: 0 };
			this.render();
		},
		append(value){
			this.items[++this.items.length] = new Item({
				coll: this,
				value: value
			});

			// this.emit
		},
		render(){
			this.views = this.views || [];

			const view = View("coll");
			this.views.push(view);
			return view;
		}
	});

	return Coll;
});


/*
How to toggle views?

Coll().render() // optional...

If coll is being created by a module that is being rendered, then automatically render the sub things..?



*/