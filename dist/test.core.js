var obj = {a: 1};
get(obj, 'a'); // 1

var obj = {a:1}; 
var getObj = get(obj);  // curried
getObj(a); // 1

var obj = {a: {b: {c: 1}}};
getIn(obj, ['a', 'b', 'c']) // 1

var obj = {a:1};
assoc(obj, 'b', 20); //, {a:1, b:20}

var obj = {a:1, b:2, c: 3};
dissoc(obj, 'a'); //, {b:2}
dissoc(obj, 'a', 'c')

var obj = {a: 1, b: 2};
update(obj, "b", (val) => val + 1); //{a: 1, b: 3}

var obj = {a: 1, b:{c: 10}};
assocIn(obj, ['b', 'c'], 20); //{a:1, b:{c: 20}}

var obj = {name:{ full_name: "aziz zaeny"}};
var res = updateIn(obj, ["name", "full_name"], upperCase);
getIn(res, ["name", "full_name"]); // "AZIZ ZAENY"

var obj1 = {a:1}
var obj2 = {a:11, b:2};
var obj3 = {c:32}
merge(obj1, obj2, obj3); //  {a:11, b:2, c:32}

var obj1 = {a:1, b: 0};
var obj2 = {a:2, b: 2};
var inc = (x) => x + 1;
mergeWith(inc, obj1, obj2); //  {a:3, b:3}

var obj = {a:1, b:2, c:3, d:4};
selectKeys(obj, ['b', 'c']); // {b:2, c:3}

renameKeys({a: 1, b:2}, {"b": "intoC"}); // {a:1, intoC: 2}

keys({a:1, b:2}) //['a','b']

vals({a:1, b:2}) // [1,2]

zipmap(['a', 'b'], [1,2]); //, {a:1, b:2}

into([], {a:1, b:2});
into({}, [['a',1], ['b', 2]]);

count([1,2]) // 2

conj(['a'], 'a') // ['a','a']
conj(['a', 'b'], ['c']) // ['a', 'b', ['c']]
conj(['a'], 'b', 'c') // ['a', 'b', 'c']

cons(0,[1,2,3]) //[0,1,2,3]

first([1,2]) //1

ffirst([[0, 1], [1,2]]) //0

nth([1,2,3,4], 2) //3

seq({a:1, b:2}) // [["a", 1], ["b", 2]]
seq('aziz') // ['a', 'z','i', 'z']

peek([1,2,3,4])  // 4

rest([1,2,3]) //[2,3]

pop([1,2,3]) //[1,2]

disj([1,2, 3],1) //  [2,3]

takeNth(2,[1,2,3,4,5,6,7,8]) // [1,3,5,7]
takeNth(3, [1,2,3,4,5,6,7,8]) //[1,4,7]

take(2, [1,2,3,4,5,6,7,8]) // [1,2]

second([1,2]) // 2

last([1,2,3,4,5]) // 5

next([1,2,3,4]) // [2,3,4]

nfirst([[1,2,3], [4,6,7]]) // [2,3]

nnext([1,2,3,4]) // [3,4]

fnext([[1,2,3], [4,5,6]]) // [4,5,6];

takeLast(2, [1,2,3,4,5,6,7]) // [6,7]
takeLast(3)([1,2,3,4,5,6]) // [4,5,6]

takeWhile((n)=> n < 5, [1,2,3,4,5,6,7,8]); // [1,2,3,4]

nthrest(2, [1,2,3,4,5,6]) // [3,4,5,6]

drop(2, [1,2,3,4,5]) // [3,4,5]

dropLast([1,2,3,4]) [1,2,3]

split('asdf asdf', ' ');

splitAt(2, [1,2,3,4,5,6]) //[ [ 1, 2 ], [ 3, 4, 5, 6 ] ]

shuffle([1,2,3,4,5,6,7,7,8]); // rnd

randNth([1,2,3,4,5,6,7]); // rnd

vec({a: 'b'}); // ['b']
vec('asdff');  // ['a', 's', 'd', 'f','f']
vec([1,2,3,4,5]); //[1,2,3,4,5]

subvec([1,2,3])

repeat(20)(2)

range(0, 10)

keep(n=>{
  if(n % 2 ===0){
    return n
  }
}, range(0,10))

keepIndexed((n,i)=>{
  if(i % 2 ===0){
    return n
  }
}, range(0,10))

find(n=> n === 2, [1,2,3,4,5,6])
find(n=> n === 7, [1,2,3,4,5,6])

map(n=> n*2, [12,13,14,15,16]);

filter(n=> n > 2)([1,2,3,4,5,6])

var isEven = n => n % 2 === 0;
var numbers = [1, 2, 3, 4, 5, 6];
var result = remove(isEven, numbers);

every(n => n > 0, [1,2,3,4,5])
every(n => n > 0, [0, 1,2,3,4,5])

reduce((acc,v) => acc + v, 0, [1,23,4,5,6,77])

concat([1,2,3,4], [5,6,7,8])

mapcat(x => [x, x * 2], [1,2,3,4])

mapIndexed((n, i) => [n, i], [1,2,3,4,5])

flatten([1,2,[3,4],[[1,2,3,4]]])

distinct([1,2,1,2,4,5,6,6,7,6,8])

interleave([1,2,3], ["a", "b","c"]) // []
zipmap([1,2,3], ["a", "b","c"]); // {}

interpose(",", ["one", "two", "three"])

reverse([0,1,2,3])

sort([1,2,3,4,5,6,5,4,1])

sortBy((n)=> n.length, ["aaa", "bb", "c"])

compare(1, 2)

groupBy(n => n > 0)([-1,2,3,4,5, -9,-2]);

partition(4, [1,2,3,4,5,6,7,8,9])

partitionAll(4, [1,2,3,4,5,6,7,8,9]);

partitionBy(n => n % 2 !== 0)([1,1,1,1,2,2,2,3,3,3,4,4,5])

frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]);

union([1,2,3,4,5], [1,2,3,8,9]);

difference([1,2,3,4,5], [0, 3, 5,6]); // 1,2,4

assert.equal(intersection([1,2], [2,3]), 2)

apply(get, [{a: 1}, "a"])

var addTwo = (x) => x + 2;
var square = (x) => x * x;
var doubleIt = (x) => x * 2;
var fns = comp(addTwo, square, doubleIt);
fns(3);

map(constantly(10), [1,2,3,4,5])

map(identity, [1,2,3,4,5,6])

let sayhello = fnil((name) => "Hello " + name, "Sir")
sayhello('aziz')
sayhello(); // default

var myfn = (a) => (console.log('hai'), (a+1));
var memofn = memoize(myfn)
memofn(1); // print hai
memofn(1)
memofn(2); // print hai
memofn(2)

everyPred(n => n > 0, n => n> 1)(2)
everyPred(n => n > 0)(1)

var empty = (arr) => arr.length === 0;
var isNotEmpty = complement(empty);
isNotEmpty([]);

var sumit = (a,b) => a + b;
map(partial(sumit, 10), [1,2,3,4]);

juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]

someFn((n) => n % 2 === 0)(2)

var myfn1 = (a, b, c, d) => a + b + c + d;

var newFn = partialRight(myfn1, 'a', 'z', 'i');
newFn('z')

var myfn2 = (a,b,c,d) => a + b + c + d;
var newFn = partialLeft(myfn2, 'a', 'z', 'i');
newFn('z');

thread(
  {a: 1},
  partialLeft(assoc, 'b', 1),
  partialLeft(assocIn, ['foo', 'abr'], '200')
); // { a: 1, b: 1, foo: { abr: '200' } }

// thread last behaviour
thread(
  22,
  (x) => x * 10,
  (x) => x +5
)

thread([22,10], map(x => x *10), map (x => x +5))

// thread first behaviour
thread(
  {a: 1},
  partialLeft(assoc, 'b', 1),
  partialLeft(assocIn, ['foo', 'abr'], '200')
); // { a: 1, b: 1, foo: { abr: '200' } }

var incr = (a) => a + 1;

threadLast(
  {a: 1},
  [seq]
)

threadLast(
  [11],
  [map, (x) => x * 7]
)

var incr = (a) => a + 1;

threadFirst(
  {a: 1},
  [assoc, "foo", "bar"],
  [assoc, "My", 1]
)

condThread(
  5,
  (x) => x > 0, (x) => x * 2,
  (x) => x < 10, (x) => x + 1,
  (x) => x % 2 === 0, (x) => x / 2
);

doseq([1,2,3,4], (item) => console.log(item));

isNotEmpty([])

isEmpty([])

isContains([1,2,3,4], 2)
isContains({a:1, b:2}, "b")
isContains('foo', 'o')

isIncludes('foo', 'o')

isZero(0)

isPos(-1)

isNeg(-1)

isEven(0)

isOdd(0)

isInt(10)

isTrue({})

isFalse(false)

isInstanceOf([],Array);
isInstanceOf([], Object)

isNil(null)

isSome(null)
isSome('a')
isSome(1)

isFn(()=>1)

isBlank("")
isBlank([])
isBlank(null)
isBlank(undefined)

isArray([])

isNumber(1)

isObject([])
isObject({})

isString("")

isIdentical(1, 1)

isEqual('a','a')

isColl({})
isColl([])

isNotEqual(1,2)

isGt(1,2)

isGte(1,2)

isLt(1,2)

isLte(1,2)





isDistinct([1,2,2])
isDistinct([1,2,3])

isEveryEven([0, 2])

isNotEveryEven([0,2])

isNotAnyEven([1])

isDeepEqual({a:1, b:{c:1}}, {a:1, b:{c:1}})

rand()

randInt(5)

add(1,2)

subtract(20,10)

multiply(10, 1)

divide(100, 10)

quot(100, 3)

mod(2,2)
mod(1, 2)
mod(1, 3)

rem(10, 20)

incr(10)

decr(10)

max(0, 100)

min(0, 20)

toInt("100")
toInt(100)

toIntSafe(10)

subs("foo", 0, 2); //fo

splitLines("hello\nworld"); // ["hello", "world"]

replace("hello world", "o", "a"); // "hella warld"

replaceFirst("hello world", "o", "a"); // "hella world"

join(["hello", "world"], " "); // "hello world"

escape("hello.world"); // "hello\.world"

rePattern("hello.*");

reMatches("hello world", "l+"); // ["ll"]

capitalize("hello world"); // "Hello world"

lowerCase("HELLO WORLD"); // "hello world"

upperCase("hello world"); // "HELLO WORLD"

trim("   hello world   "); // "hello world"

trimNewLine('\nhello\nworld\n')

trimL('\nfoo')

trimR('foo\n')

char(56);

reset(s, 100);

swap(s, (n)=> n - 10)

compareAndSet(s, 90, 200)
deref(s);

addWatch(s, 'foo', (n, o) => console.log(n,o));
reset(s, 100);

removeWatch(s, "foo");

setValidator(s, (n)=> n >0);
reset(s, 100)
reset(s, 0)
s.deref()

removeValidator(s)

var s = atom(10);
s.deref()
s.reset(20);
s.swap(value => value * 2);
s.addWatch("logger", (oldState, newState) => console.log(`State changed from ${oldState} to ${newState}`));
s.addWatch("alert", (oldState, newState) => console.log(`State changed from ${oldState} to ${newState}`));
s.removeWatch("logger"); // Remove the "logger" watch function
s.setValidator(newValue => newValue > 0);
s.removeValidator()
s.reset(-20);
s.compareAndSet(-20, 20)
s.compareAndSet(-20, 20)
s.deref();

var greetings = defMulti((x) => get(x, "langauge"))

defMethod(greetings, "English", (params) => "Hello")