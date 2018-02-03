Savable Collections:
	> build .json() recursively
	> auto-save?
	>


unique item wrappers?
	+ helps with rendering lists and identifying which item (if duplicates)
	+ avoids searching by value
	+ gives direct reference to that item in that position
	+ gives object oriented .remove() method
	+ gives collection-specific scope (data)

use [] or {}?
	[] aren't great for sparse arrays
		-> if you store items by incremental id, and delete some of them, and want to refrain from reusing old (stale) ids, you end up with sparse arrays
	{} I'm not sure these are great for iterating large sparse arrays anyway, however...  Does the js engine sort the numeric indices before iterating?  Or does it just store them in that order?  So that when you add an item out of order, it has to do a bunch of work?  Who knows...

savable?
	cache json?
		if .save() is called whenever something .changes, maybe we don't need to
	this.json() & this.data() ?
	auto-save on every change?

.set + events?
	"change" and "change.propName" events