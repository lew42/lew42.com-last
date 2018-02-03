define("StringObject", ["Value", "Collection"], function(require, exports, module){
////////

const Value = require("Value");
const Collection = require("Collection");

const StringValueView = View.extend("StringObjectView", {

});

const StringObject = module.exports = Value.extend("StringObject", {
	View: StringObjectView
});

const StringCollectionView = View.extend("StringCollectionView", {});

const StringCollection = Collection.extend("StringCollection", {
	Item: StringObject, // StringItem?
	View: StringCollectionView,
});

}); // end