items...render();

// Why can't we do
...[1, 2, 3] // what would this be? 

/*
You almost need hard groups [1, 2, 3]
And soft groups (1, 2, 3)

So, [(1, 2), (3, 4)] would equal [1, 2, 3, 4]
() = list
[] = group ?
need better names...
list, to me, means "ordered"

[[1, 2], [3, 4]] does not change


There's not much difference, between (1, 2, 3), and [1, 2, 3], when it's a standalone value.  The API and desirable usage is mostly the same. 

It would only matter when you:
fn((1, 2, 3)) --> fn(1, 2, 3)

so, softy = (1, 2, 3)
and fn(softy) --> fn(1, 2, 3);

vs 

hard = [1, 2, 3]
and fn(hard) --> fn([1, 2, 3])


This is sort of like immutable and mutable...
(1, 2, 3) could represent an immutable list (not referential arrays)

And so, fn(soft) --> arg !== soft?
Or... it does?
5 === 5...
(1, 2, 3) === (1, 2, 3)

where 
[1, 2, 3] !== [1, 2, 3]


*/

/*
All the things
*/

var arr = [1, 2, 3];

[arr] // [ [1, 2, 3] ]
[...arr] // [1, 2, 3]
[arr...] // [1, 2, 3] ?



var [another] = arr;
another // 1

// "rest": always the rest, always to the end of the array
var [...another] = arr;
another // [1, 2, 3]

// throw: Rest element must be last
var [...another, last] = arr;


var [one, ...two] = arr;
one // 1
two // [2, 3]




fn(arr); // fn([1, 2, 3])
fn(...arr); // fn(1, 2, 3)
fn(arr...);  // ?? any better?



function fn(arg){

}