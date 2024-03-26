## Clojure.core
clojure functional libarary in javascript

### Object
**@zaeny/clojure.core/objects** plain javascript object manipulation

#### get 
`(get map key)(get map key not-found)` 


```js path=dist/core.js
function get(...args){
  let [obj, key] = args;
  if(args.length === 2){
    return obj[key];
  }else{
    return (keyA) => obj[keyA];
  }
}
```

usage :

```js path=dist/test.core.js
var obj = {a: 1};
get(obj, 'a'); // 1

var obj = {a:1}; 
var getObj = get(obj);  // curried
getObj(a); // 1
```

#### getIn 
`(get-in m ks)(get-in m ks not-found)`
```js path=dist/core.js

function getIn(...args){
  let [coll, keys] = args;
  if(args.length === 2){
    return keys.reduce((acc, key) =>{
      if(acc && typeof acc === "object" && key in acc){
        return acc[key];
      }else{
        return undefined;
      }
    }, coll);
  }else{
    return (keysA) => getIn(coll, keysA);
  }
}

```
usage :

```js path=dist/test.core.js
var obj = {a: {b: {c: 1}}};
getIn(obj, ['a', 'b', 'c']) // 1

```
#### assoc
`(assoc map key val)(assoc map key val & kvs)`

```js path=dist/core.js
function assoc(...args){
  let [obj, key, val] = args;
  if (args.length === 3) {
    return { ...obj, [key]: val };
  } else if (args.length === 2) {
    return (val) => assoc(obj, key, val);
  }else{
    return (key, val) => assoc(obj, key, val);
  }
}

```
usage:

```js path=dist/test.core.js
var obj = {a:1};
assoc(obj, 'b', 20); //, {a:1, b:20}

```
#### dissoc 
`(dissoc map)(dissoc map key)(dissoc map key & ks)`

```js path=dist/core.js

function dissoc(...args) {
  let [obj, ...keys] = args;
  if (args.length === 1) {
    return (...keysA) => dissoc(obj, ...keysA);
  }
  let newObj = { ...obj };
  keys.forEach(key => delete newObj[key]);
  return newObj;
}

```

usage:

```js path=dist/test.core.js
var obj = {a:1, b:2, c: 3};
dissoc(obj, 'a'); //, {b:2}
dissoc(obj, 'a', 'c')
```

#### update
`(update m k f)(update m k f x)(update m k f x y)(update m k f x y z)(update m k f x y z & more)`

```js path=dist/core.js
function update(...args){
  let [coll, key, updateFn] = args;
  if (args.length === 1) return (key, updateFn) => update(coll, key, updateFn);
  if (args.length === 2) return (updateFn) => update(coll, key, updateFn); 
  if(Array.isArray(coll)){
    let newColl = [...coll];
    return (newColl[key] = updateFn(coll[key]), newColl);
  }
  return { // todo: fix assume type object
    ...coll,
    [key]: updateFn(coll[key])
  };
}
```

usage:

```js path=dist/test.core.js
var obj = {a: 1, b: 2};
update(obj, "b", (val) => val + 1); //{a: 1, b: 3}

```

#### assocIn
`(assoc-in m [k & ks] v)`
```js path=dist/core.js
function assocIn(...args) {
  let [obj, keys, val] = args;
  if (args.length === 3) {
    keys = Array.isArray(keys) ? keys : [keys];
    const [firstKey, ...restKeys] = keys;
    const nestedValue = restKeys.length === 0 ? val : assocIn(obj[firstKey] || {}, restKeys, val);
    return assoc(obj, firstKey, nestedValue);
  } else if (args.length === 2) {
    return (val) => assocIn(obj, keys, val);
  } else if (args.length === 1) {
    return (keys, val) => assocIn(obj, keys, val);
  }
}
```
usage:

```js path=dist/test.core.js
var obj = {a: 1, b:{c: 10}};
assocIn(obj, ['b', 'c'], 20); //{a:1, b:{c: 20}}
```

#### updateIn
`(update-in m ks f & args)`

```js path=dist/core.js

function updateIn(...args){
  let [object, keys, updateFn] = args;
  if (args.length === 1) return (keys, updateFn) => updateIn(object, keys, updateFn)
  if (args.length === 2) return (updateFn) => updateIn(object, keys, updateFn);    
  const [key, ...rest] = keys;
  if (rest.length === 0) {
    return update(object, key, updateFn);
  }
  return update(object, key, (value) => updateIn(value, rest, updateFn));
}

```
usage:

```js path=dist/test.core.js
var obj = {name:{ full_name: "aziz zaeny"}};
var res = updateIn(obj, ["name", "full_name"], upperCase);
getIn(res, ["name", "full_name"]); // "AZIZ ZAENY"

```

#### merge
`(merge & maps)`
```js path=dist/core.js
function merge(...args){
  let [obj1, obj2] = args;
  if(args.length === 1) return (obj1) => merge(obj1, obj2);
  return Object.assign({}, ...args);
}
```

usage:

```js path=dist/test.core.js
var obj1 = {a:1}
var obj2 = {a:11, b:2};
var obj3 = {c:32}
merge(obj1, obj2, obj3); //  {a:11, b:2, c:32}
```

#### mergeWith
`(merge-with f & maps)`

```js path=dist/core.js
function mergeWith(...args){
  let [fn, ...maps] = args;
  if( args.length === 1) return (...maps) => mergeWith(fn, ...maps);
  if (maps.length === 0) {
    return {};
  } else if (maps.length === 1) {
    return maps[0];
  } else {
    const [head, ...tail] = maps;
    const merged = mergeWith(fn, ...tail);
    const result = {};
    for (const [key, value] of Object.entries(head)) {
      if (key in merged) {
        result[key] = fn(merged[key], value);
      } else {
        result[key] = value;
      }
    }
    for (const [key, value] of Object.entries(merged)) {
      if (!(key in head)) {
        result[key] = value;
      }
    }
    return result;
  }
}
```

usage:
```js path=dist/test.core.js
var obj1 = {a:1, b: 0};
var obj2 = {a:2, b: 2};
var inc = (x) => x + 1;
mergeWith(inc, obj1, obj2); //  {a:3, b:3}

```

#### selectKeys
`(select-keys map keyseq)`
```js path=dist/core.js
function selectKeys(...args){
  let [obj, keys] = args;
  if (args.length === 2) {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => keys.includes(key)));
  } else if (args.length === 1) {
    return (keys) => selectKeys(obj, keys);
  }
}
```
usage:
```js path=dist/test.core.js
var obj = {a:1, b:2, c:3, d:4};
selectKeys(obj, ['b', 'c']); // {b:2, c:3}
```

#### renameKeys
`(rename-keys map kmap)`

```js path=dist/core.js
function renameKeys(...args){
  let [obj, keyMap] = args;
  if(args.length === 1){
    return (keyMapA) => renameKeys(obj, keyMapA);
  }
  return Object.entries(obj)
    .reduce((acc, [key, value]) => keyMap[key] ? { ...acc, [keyMap[key]]: value } : { ...acc, [key]: value }, {});
}
```
usage:
```js path=dist/test.core.js
renameKeys({a: 1, b:2}, {"b": "intoC"}); // {a:1, intoC: 2}
```

#### keys
```js path=dist/core.js
function keys(obj){ return Object.keys(obj); }
```

usage: 
```js path=dist/test.core.js
keys({a:1, b:2}) //['a','b']
```

#### vals
```js path=dist/core.js
function vals(obj){ return Object.values(obj); }
```

usage: 
```js path=dist/test.core.js
vals({a:1, b:2}) // [1,2]
```

#### zipmap
```js path=dist/core.js
function zipmap(...args){
  let [keys, vals] = args;
  if(args.length === 1){
    return (valsA) => zipmap(keys, valsA);
  }
  return keys.reduce((result, key, i) => {
    result[key] = vals[i];
    return result;
  }, {});
}

```

usage: 
```js path=dist/test.core.js
zipmap(['a', 'b'], [1,2]); //, {a:1, b:2}
```

### Collections

**@zaeny/clojure.core/collections** Array manipulation  

#### into 
`(into)(into to)(into to from)(into to xform from)`

```js path=dist/core.js

function into(...args){
  let [target, iterable] = args;
  if(args.length === 1) return (iterable) => into(target, iterable);
  if(target instanceof Object && target.constructor === Object){
    return iterable.reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, {});
  }
  if(Array.isArray(target)){
    return Object.entries(iterable).map(([key, value]) => [key, value]);
  }
  return new Error('only accept target object or array');
}
```

```js path=dist/test.core.js
into([], {a:1, b:2});
into({}, [['a',1], ['b', 2]]);
```

#### count

`(count coll)`
```js path=dist/core.js
var count = (coll) => coll.length;
```

usage: 
```js path=dist/test.core.js
count([1,2]) // 2
```

#### conj
`(conj)(conj coll)(conj coll x)(conj coll x & xs)`

```js path=dist/core.js
var conj = (...args) =>{
  let [coll, ...items] = args;
  return (args.length === 1)
    ? (itemA) => conj(coll, itemA)
    : [...coll, ...items]
}
```
usage: 
```js path=dist/test.core.js
conj(['a'], 'a') // ['a','a']
conj(['a', 'b'], ['c']) // ['a', 'b', ['c']]
conj(['a'], 'b', 'c') // ['a', 'b', 'c']

```

#### cons
`(cons x seq)`
```js path=dist/core.js
var cons = (...args) =>{
  let [item, ...seq] = args;
  return (args.length === 1)
    ? (seqA) => cons(item, seqA)
    : [item].concat(...seq)
}
```

usage: 
```js path=dist/test.core.js
cons(0,[1,2,3]) //[0,1,2,3]
```

#### first
`(first coll)`
```js path=dist/core.js
var first = (seq) => seq[0];
```

usage: 
```js path=dist/test.core.js
first([1,2]) //1

```


#### ffirst
`(ffirst coll)`
```js path=dist/core.js
var ffirst = (seq) => first(seq[0])
```

usage: 
```js path=dist/test.core.js
ffirst([[0, 1], [1,2]]) //0
```

#### nth
`(nth coll index)(nth coll index not-found)`
```js path=dist/core.js
var nth = (...args) => {
  let [seq, n] = args;
  if(args.length === 1) return (nn) => nth(seq, nn);
  return seq[n];
}
```

usage: 
```js path=dist/test.core.js
nth([1,2,3,4], 2) //3

```

#### seq 
`(seq coll)` sequence in this is converting objects & strings
aka: `Object.entries` in javascript to convert if object

```js path=dist/core.js
var seq = (arg) =>{
  if(Array.isArray(arg)){
    return arg;
  }
  if(typeof arg === "object"){
    return Object.entries(arg);
  }
  if(typeof arg === "string"){
    return Array.from(arg);
  }
  return arg;
}
```

usage:
```js path=dist/test.core.js
seq({a:1, b:2}) // [["a", 1], ["b", 2]]
seq('aziz') // ['a', 'z','i', 'z']
```

#### peek
`(peek coll)`
```js path=dist/core.js
var peek = (stack) => stack[stack.length - 1];
```

usage: 
```js path=dist/test.core.js
peek([1,2,3,4])  // 4
```

#### rest
`(rest coll)`
```js path=dist/core.js
var rest = (seq) => seq.slice(1);
```

usage: 
```js path=dist/test.core.js
rest([1,2,3]) //[2,3]
```

#### pop
`(pop coll)`
```js path=dist/core.js
var pop = (stack) => stack.slice(0, -1);
```

usage: 
```js path=dist/test.core.js
pop([1,2,3]) //[1,2]
```

#### disj
`(disj set)(disj set key)(disj set key & ks)`

```js path=dist/core.js
var disj = (...args) =>{
  let [coll, key, ...rest] = args;
  if (args.length === 2) {
    return coll.filter((item) => item !== key);
  } else if (args.length === 1) {
    return (key) => disj(coll, key);
  }
}
```

usage: 
```js path=dist/test.core.js
disj([1,2, 3],1) //  [2,3]
```

#### takeNth
`(take-nth n)(take-nth n coll)`
```js path=dist/core.js
var takeNth = (...args) => {
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => takeNth(n, coll)
  }
  return arr.filter((_, i) => i % n === 0);
}
```

usage: 
```js path=dist/test.core.js
takeNth(2,[1,2,3,4,5,6,7,8]) // [1,3,5,7]
takeNth(3, [1,2,3,4,5,6,7,8]) //[1,4,7]
```

#### take
`(take n)(take n coll)`
```js path=dist/core.js
var take = (...args) =>{
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => take(n, coll);
  }
  return arr.slice(0, n);
}
```

usage: 
```js path=dist/test.core.js
take(2, [1,2,3,4,5,6,7,8]) // [1,2]
```

#### second
`(second x)`
```js path=dist/core.js
var second = ([_, x]) => x;
```

usage: 
```js path=dist/test.core.js
second([1,2]) // 2
```

#### last
`(last coll)`
```js path=dist/core.js
var last = (arr) => arr[arr.length - 1];
```

usage: 
```js path=dist/test.core.js
last([1,2,3,4,5]) // 5
```

#### next
`(next coll)`
```js path=dist/core.js
var next = ([_, ...rest]) => { return rest; }
```

usage: 
```js path=dist/test.core.js
next([1,2,3,4]) // [2,3,4]
```

#### nfirst
`(nfirst x)`
```js path=dist/core.js
var nfirst = (arr) =>  next(first(arr));
```

usage: 
```js path=dist/test.core.js
nfirst([[1,2,3], [4,6,7]]) // [2,3]
```

#### nnext
`(nnext x)`
```js path=dist/core.js
var nnext = (arr) => next(next(arr));
```

usage: 
```js path=dist/test.core.js
nnext([1,2,3,4]) // [3,4]
```

#### fnext
`(fnext x)`
```js path=dist/core.js
var fnext = (arr) => first(next(arr));
```

usage: 
```js path=dist/test.core.js
fnext([[1,2,3], [4,5,6]]) // [4,5,6];
```

#### takeLast
`(take-last n coll)`
```js path=dist/core.js
var takeLast= (...args)=>{
  let [n, arr] = args
  if(args.length === 1) return (arr1) => takeLast(n, arr1);
  return arr.slice(-n);  
}
```

usage: 
```js path=dist/test.core.js
takeLast(2, [1,2,3,4,5,6,7]) // [6,7]
takeLast(3)([1,2,3,4,5,6]) // [4,5,6]
```

#### takeWhile
`(take-while pred)(take-while pred coll)`
```js path=dist/core.js
var takeWhile = (...args) =>{
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => takeWhile(predicate, coll)
  }
  const index = arr.findIndex(val => !predicate(val))
  return index === -1 ? arr : arr.slice(0, index)
}
```

usage: 
```js path=dist/test.core.js
takeWhile((n)=> n < 5, [1,2,3,4,5,6,7,8]); // [1,2,3,4]
```

#### nthrest
`(nthrest coll n)`
```js path=dist/core.js
var nthrest = (...args) =>{
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => nthrest(n, coll)
  }
  return arr.filter((_, i) => i >= n)
}
```

usage: 
```js path=dist/test.core.js
nthrest(2, [1,2,3,4,5,6]) // [3,4,5,6]
```


#### drop
`(drop n)(drop n coll)`
```js path=dist/core.js
var drop = (...args) => {
  let [n, arr] = args;
  if(args.length === 1) {
    return (arr1) => drop(n, arr1);
  }
  return arr.slice(n);
}
```

usage: 
```js path=dist/test.core.js
drop(2, [1,2,3,4,5]) // [3,4,5]
```

#### dropLast
`(drop-last coll)(drop-last n coll)`
```js path=dist/core.js
var dropLast = (arr) => { return arr.slice(0, -1); }
```

usage: 
```js path=dist/test.core.js
dropLast([1,2,3,4]) [1,2,3]
```

#### dropWhile (TODO)

#### splitAt
`(split-with pred coll)`
```js path=dist/core.js

var splitAt = (...args) =>{
  let [n, coll] = args;
  return (args.length === 1)
    ? (colln) => splitAt(n, colln)
    : [coll.slice(0, n), coll.slice(n)]
}

```

usage: 
```js path=dist/test.core.js
splitAt(2, [1,2,3,4,5,6]) //[ [ 1, 2 ], [ 3, 4, 5, 6 ] ]
```

#### splitWith (TODO)
`(split-with pred coll)`

#### shuffle
`(shuffle coll)`
```js path=dist/core.js
var shuffle = (coll) => {
  const result = coll.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

```

usage: 
```js path=dist/test.core.js
shuffle([1,2,3,4,5,6,7,7,8]); // rnd
```


#### randNth
`(rand-nth coll)`
```js path=dist/core.js
var randNth = (coll) => {
  const i = Math.floor(Math.random() * coll.length);
  return coll[i];
};

```

usage: 
```js path=dist/test.core.js
randNth([1,2,3,4,5,6,7]); // rnd
```

#### vec
`(vec coll)`
```js path=dist/core.js
var vec = (coll) =>{
  if (!coll) {
    return [];
  }
  if (Array.isArray(coll)) {
    return coll;
  }
  if (typeof coll === 'string') {
    return coll.split('');
  }
  if (typeof coll[Symbol.iterator] === 'function') {
    return Array.from(coll);
  }
  return Object.values(coll);
}
```

usage: 
```js path=dist/test.core.js
vec({a: 'b'}); // ['b']
vec('asdff');  // ['a', 's', 'd', 'f','f']
vec([1,2,3,4,5]); //[1,2,3,4,5]
```

#### subvec
`(subvec v start)(subvec v start end)`
```js path=dist/core.js
var subvec = (coll, start, end)=>{
  if (!end) {
    end = coll.length;
  }
  if (start < 0 || end < 0) {
    throw new Error('start and end must be non-negative');
  }
  return coll.slice(start, end);
}
```

usage: 
```js path=dist/test.core.js
subvec([1,2,3])
```


#### repeat
`(repeat x)(repeat n x)`
```js path=dist/core.js

// repeat implementation
var repeat = (...args) => {
  let [n, value] = args;
  if(args.length === 1) return (nvalue) => repeat(n,nvalue);
  let result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = value;
  }
  return result;
};

```

usage: 
```js path=dist/test.core.js
repeat(20)(2)
```

#### range
`(range)(range end)(range start end)(range start end step)`
```js path=dist/core.js
var range = (...args) => {
  let [start, end, step=1] = args
  if (args.length === 1) {
    end = start;
    start = 0;
  }
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

```
usage: 
```js path=dist/test.core.js
range(0, 10)
```

#### keep
`(keep f)(keep f coll)`
```js path=dist/core.js
var keep = (...args) => {
  let [pred, coll] = args;
  if(args.length === 1) return (ncoll) => keep(pred, ncoll);
  return coll.reduce((acc, curr) => {
    const result = pred(curr);
    if (result !== null && result !== undefined) {
      acc.push(result);
    }
    return acc;
  }, []);
}

```

usage: 
```js path=dist/test.core.js
keep(n=>{
  if(n % 2 ===0){
    return n
  }
}, range(0,10))
```

#### keepIndexed
`(keep-indexed f)(keep-indexed f coll)`
```js path=dist/core.js

var keepIndexed = (...args) => {
  let [pred, coll] = args;
  if(args.length === 1) return (ncoll) => keepIndexed(pred, ncoll);  
  return coll.reduce((acc, curr, idx) => {
    const result = pred(idx, curr);
    if (result !== null && result !== undefined) {
      acc.push(result);
    }
    return acc;
  }, []);
}

```
usage: 
```js path=dist/test.core.js
keepIndexed((n,i)=>{
  if(i % 2 ===0){
    return n
  }
}, range(0,10))
```

#### find
`(find map key)`
```js path=dist/core.js
var find = (...args) => {
  let [pred, coll] = args;
  if(args.length === 1) return (ncoll) => find(pred, ncoll);
  for (const item of coll) {
    if (pred(item)) {
      return item;
    }
  }
  return undefined;
};

```

usage: 
```js path=dist/test.core.js

find(n=> n === 2, [1,2,3,4,5,6])
find(n=> n === 7, [1,2,3,4,5,6])
```

#### map
`(map f)(map f coll)(map f c1 c2)(map f c1 c2 c3)(map f c1 c2 c3 & colls)`
```js path=dist/core.js

var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}

```

usage: 
```js path=dist/test.core.js
map(n=> n*2, [12,13,14,15,16]);
```

#### filter
`(filter pred)(filter pred coll)`
```js path=dist/core.js

var filter = (...args) =>{
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => filter(predicate, coll);
  }
  return arr.filter(predicate);
}

```

usage: 
```js path=dist/test.core.js
filter(n=> n > 2)([1,2,3,4,5,6])
```

#### remove
`(remove pred)(remove pred coll)`
```js path=dist/core.js

var remove = (...args) =>{
  let [pred, coll] = args;
  return (args.length === 1) ? (colln) => remove(pred, colln) :  coll.filter(item => !pred(item));
}

```

usage: 
```js path=dist/test.core.js
var isEven = n => n % 2 === 0;
var numbers = [1, 2, 3, 4, 5, 6];
var result = remove(isEven, numbers);
```


#### every
`(every pred)(every pred coll)`

```js path=dist/core.js

var every = (...args) =>{
  let [predicate, arr] = args ;
  if(args.length === 1){
    return coll => every(predicate, coll);
  }
  return arr.every(predicate);
}

```

usage: 
```js path=dist/test.core.js
every(n => n > 0, [1,2,3,4,5])
every(n => n > 0, [0, 1,2,3,4,5])
```

#### reduce
`(reduce f coll)(reduce f val coll)`
```js path=dist/core.js

var reduce = (...args) => {
  let [reducer, initialValue, arr] = args;
  if(args.length === 1){
    return coll => reduce(reducer, null, coll);
  }
  if (args.length === 2) {
    return coll => reduce(reducer, initialValueHolder, coll)
  }
  return arr.reduce(reducer, initialValue)
}

```

usage: 
```js path=dist/test.core.js
reduce((acc,v) => acc + v, 0, [1,23,4,5,6,77])
```

#### concat
`(concat)(concat x)(concat x y)(concat x y & zs)`
```js path=dist/core.js
var concat=(...args)=>{
  let [arr1, arr2] = args;
  if (args.length === 1) {
    return (arr2Holder) => concat(arr1, arr2Holder)
  }
  return arr1.concat(arr2)
}

```
usage: 
```js path=dist/test.core.js
concat([1,2,3,4], [5,6,7,8])
```

#### mapcat
`(mapcat f)(mapcat f & colls)`
```js path=dist/core.js
var mapcat=(...args)=>{
  let [fn, arr]= args;
  if (args.length === 1) {
    return coll => mapcat(fn, coll);
  }
  return arr.map(fn).reduce((acc, val) => acc.concat(val), [])
}

```

usage: 
```js path=dist/test.core.js
mapcat(x => [x, x * 2], [1,2,3,4])
```

#### mapIndexed
`(map-indexed f)(map-indexed f coll)`
```js path=dist/core.js
var mapIndexed = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return arr => arr.map((val, idx) => fn(val, idx));
  } else {
    return arr.map((val, idx) => fn(val, idx));
  }
}
```

usage: 
```js path=dist/test.core.js
mapIndexed((n, i) => [n, i], [1,2,3,4,5])
```

#### flatten
`(flatten x)`

```js path=dist/core.js
var flatten =(...args) => {
  let [arr, level] = args;
  if(args.length === 1){
    level = Infinity;
  }
  return arr.flat(level);
}

```

usage: 
```js path=dist/test.core.js
flatten([1,2,[3,4],[[1,2,3,4]]])
```

#### distinct
`(distinct)(distinct coll)`
```js path=dist/core.js
var distinct = (arr) =>{
  return [...new Set(arr)];
}

```

usage: 
```js path=dist/test.core.js
distinct([1,2,1,2,4,5,6,6,7,6,8])
```

#### interleave
`(interleave)(interleave c1)(interleave c1 c2)(interleave c1 c2 & colls)`
```js path=dist/core.js
var interleave = (...arrays) =>{
  if (arrays.length === 1) {
    return arr => arrays.reduce((acc, arr) => acc.flatMap((val, i) => [val, arr[i]]), arr.shift());
  } else {
    return arrays.reduce((acc, arr) => acc.flatMap((val, i) => [val, arr[i]]), arrays.shift());
  }  
}

```

usage: 
```js path=dist/test.core.js
interleave([1,2,3], ["a", "b","c"]) // []
zipmap([1,2,3], ["a", "b","c"]); // {}
```

#### interpose
`(interpose sep)(interpose sep coll)`
```js path=dist/core.js

var interpose = (...args) => {
  let [sep, arr] = args;
  if (args.length === 1) {
    return arr => arr.flatMap((val, i) => i === arr.length - 1 ? val : [val, sep]);
  } else {
    return arr.flatMap((val, i) => i === arr.length - 1 ? val : [val, sep]);
  } 
}

```

usage: 
```js path=dist/test.core.js
interpose(",", ["one", "two", "three"])
```

#### reverse
`(reverse coll)`
```js path=dist/core.js

var reverse = (...args) =>{
  let [arr] = args;
  return args.length === 1 ? [...arr].reverse() : arr.reverse();
}

```

usage: 
```js path=dist/test.core.js
reverse([0,1,2,3])
```

#### sort
`(sort coll)(sort comp coll)`
```js path=dist/core.js

var sort = (...args) => {
  let [arr, comparator = (a, b) => a - b] = args;
  return args.length === 1 ? [...arr].sort() : [...arr].sort(comparator);
}

```

usage: 
```js path=dist/test.core.js
sort([1,2,3,4,5,6,5,4,1])

```

#### sortBy
`(sort-by keyfn coll)(sort-by keyfn comp coll)`
```js path=dist/core.js

var sortBy=(...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return arr => [...arr].sort((a, b) => fn(a) - fn(b));
  } else {
    return [...arr].sort((a, b) => fn(a) - fn(b));
  }
}

```

usage: 
```js path=dist/test.core.js
sortBy((n)=> n.length, ["aaa", "bb", "c"]) 
```

#### compare
`(compare x y)`
```js path=dist/core.js

var compare = (a , b) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

```
usage: 
```js path=dist/test.core.js
compare(1, 2)
```

#### groupBy
`(group-by f coll)`
```js path=dist/core.js

var groupBy = (...args) =>{
  let [fn, arr] = args;
  if(args.length === 1){
    return (coll) => groupBy(fn, coll);
  }
  return arr.reduce((acc, curr) => {
    const key = fn(curr);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});
}

```

usage: 
```js path=dist/test.core.js
groupBy(n => n > 0)([-1,2,3,4,5, -9,-2]);
```

#### partition (todo: fix behaviour)
`(partition n coll)(partition n step coll)(partition n step pad coll)`
```js path=dist/core.js

var partition=(...args) =>{
  let [size, arr] = args;
  if(args.length === 1){
    return (coll) => partition(size, coll);
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

```

usage: 
```js path=dist/test.core.js
partition(4, [1,2,3,4,5,6,7,8,9])
```

#### partitionAll
`(partition-all n)(partition-all n coll)(partition-all n step coll)`
```js path=dist/core.js

var partitionAll=(...args) =>{
  let [size, arr] = args;
  if(args.length === 1){
    return (coll) => partitionAll(size, coll);
  }
  if (!arr || !arr.length) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

```

usage: 
```js path=dist/test.core.js
partitionAll(4, [1,2,3,4,5,6,7,8,9]); 
```

#### partitionBy
`(partition-by f)(partition-by f coll)`
```js path=dist/core.js

var partitionBy=(...args)=>{
  let [fn, coll] = args;
  if(args.length === 1){
    return (coll) => partitionBy(fn, coll);
  }
  const result = [];
  let group = [];
  let prevValue;
  for (const elem of coll) {
    const value = fn(elem);
    if (value === prevValue || prevValue === undefined) {
      group.push(elem);
    } else {
      result.push(group);
      group = [elem];
    }
    prevValue = value;
  }
  if (group.length > 0) {
    result.push(group);
  }
  return result;
}

```

usage: 
```js path=dist/test.core.js
partitionBy(n => n % 2 !== 0)([1,1,1,1,2,2,2,3,3,3,4,4,5])
```

#### frequencies
`(frequencies coll)`
```js path=dist/core.js

var frequencies = (coll) => {
  const freqMap = new Map();
  for (const el of coll) {
    freqMap.set(el, (freqMap.get(el) || 0) + 1);
  }
  return Object.fromEntries(freqMap);
}

```

usage: 
```js path=dist/test.core.js
frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]);
```

#### union
`(union)(union s1)(union s1 s2)(union s1 s2 & sets)`
```js path=dist/core.js
var union = (...args) => {
  let [set1, set2] = args;
  return (args.length == 1) ? (set) => union(set1, set) : Array.from(new Set([...set1, ...set2]));
}

```

usage: 
```js path=dist/test.core.js
union([1,2,3,4,5], [1,2,3,8,9]);
```

#### difference
`(difference s1)(difference s1 s2)(difference s1 s2 & sets)`
```js path=dist/core.js

var difference =(...args) => {
  let [arr1, arr2] = args;
  if(args.length === 1) return (arr) => difference(arr1, arr);
  return arr1.filter((x) => !arr2.includes(x));
}

```

usage: 
```js path=dist/test.core.js
difference([1,2,3,4,5], [0, 3, 5,6]); // 1,2,4
```

#### intersection
`(intersection s1)(intersection s1 s2)(intersection s1 s2 & sets)`
```js path=dist/core.js
var intersection = (...args) =>{
  let [arr1, arr2] = args;
  if(args.length === 1) return (arr) => intersection(arr1, arr);
  return arr1.filter((x) => arr2.includes(x));
}
```

usage: 
```js path=dist/test.core.js
assert.equal(intersection([1,2], [2,3]), 2)
```

#### whenFirst (TODO)
`(when-first bindings & body)`

### Functions
**@zaeny/clojure.core/functions**

#### apply
`(apply f args)(apply f x args)(apply f x y args)(apply f x y z args)(apply f a b c d & args)`

```js path=dist/core.js

function apply(...argv) {
  let [fn, args] = argv;  
  return (argv.length === 1) ? (argn) => apply(fn, argn) : fn(...args);
}

```

usage: 
```js path=dist/test.core.js
apply(get, [{a: 1}, "a"])

```

#### comp
`(comp)(comp f)(comp f g)(comp f g & fs)`

```js path=dist/core.js

function comp(...fns) {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

```

usage: 
```js path=dist/test.core.js
var addTwo = (x) => x + 2;
var square = (x) => x * x;
var doubleIt = (x) => x * 2;
var fns = comp(addTwo, square, doubleIt);
fns(3);
```

#### constantly
`(constantly x)`

```js path=dist/core.js

function constantly(x) {
  return function() {
    return x;
  };
}

```

usage: 
```js path=dist/test.core.js
map(constantly(10), [1,2,3,4,5])
```

#### identity
`(identity f)`

```js path=dist/core.js

function identity(x) {
  return x;
}

```

usage: 
```js path=dist/test.core.js
map(identity, [1,2,3,4,5,6])
```

#### fnil
`(fnil f x)(fnil f x y)(fnil f x y z)`
```js path=dist/core.js

function fnil(f, defaultVal) {
  return function() {
    const args = Array.from(arguments);
    const numArgs = f.length;
    while (args.length < numArgs) {
      args.push(defaultVal);
    }
    return f.apply(null, args);
  };
}

```
usage: 
```js path=dist/test.core.js
let sayhello = fnil((name) => "Hello " + name, "Sir")
sayhello('aziz')
sayhello(); // default

```
#### memoize
`(memoize f)`
```js path=dist/core.js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
    return cache.get(key);
  };
}

```

usage: 
```js path=dist/test.core.js
var myfn = (a) => (console.log('hai'), (a+1));
var memofn = memoize(myfn)
memofn(1); // print hai
memofn(1)
memofn(2); // print hai
memofn(2)
```


#### everyPred
`(every-pred p)(every-pred p1 p2)(every-pred p1 p2 p3)(every-pred p1 p2 p3 & ps)`
```js path=dist/core.js

function everyPred(...fns) {
  return function(x) {
    for (let i = 0; i < fns.length; i++) {
      if (!fns[i](x)) {
        return false;
      }
    }
    return true;
  };
}

```
usage: 
```js path=dist/test.core.js
everyPred(n => n > 0, n => n> 1)(2)
everyPred(n => n > 0)(1)
```

#### complement
`(complement f)`
```js path=dist/core.js

function complement(fn) {
  return function(...args) {
    return !fn(...args);
  };
}

```
usage: 
```js path=dist/test.core.js
var empty = (arr) => arr.length === 0;
var isNotEmpty = complement(empty);
isNotEmpty([]);
```


#### partial
`(partial f)(partial f arg1)(partial f arg1 arg2)(partial f arg1 arg2 arg3)(partial f arg1 arg2 arg3 & more)`
```js path=dist/core.js

function partial(fn, ...args) {
  return function(...moreArgs) {
    return fn(...args, ...moreArgs);
  };
}

```
usage: 
```js path=dist/test.core.js
var sumit = (a,b) => a + b;
map(partial(sumit, 10), [1,2,3,4]);

```

#### juxt
`(juxt f)(juxt f g)(juxt f g h)(juxt f g h & fs)`

```js path=dist/core.js

function juxt(...fns) {
  return function(...args) {
    return fns.map(function(fn) {
      return fn(...args);
    });
  };
}

```
usage: 
```js path=dist/test.core.js
juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]
```

#### someFn
`(some-fn p)(some-fn p1 p2)(some-fn p1 p2 p3)(some-fn p1 p2 p3 & ps)`
```js path=dist/core.js

function someFn(...fns) {
  return function(x) {
    for (let i = 0; i < fns.length; i++) {
      if (fns[i](x)) {
        return true;
      }
    }
    return false;
  };
}

```
usage: 
```js path=dist/test.core.js
someFn((n) => n % 2 === 0)(2)
```

#### partialRight
```js path=dist/core.js
var partialRight = (fn, ...leftArgs) => {
  return (...rightArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

```
usage: 
```js path=dist/test.core.js
var myfn1 = (a, b, c, d) => a + b + c + d;

var newFn = partialRight(myfn1, 'a', 'z', 'i');
newFn('z')
```

#### partialLeft
```js path=dist/core.js
var partialLeft = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

```
usage: 
```js path=dist/test.core.js
var myfn2 = (a,b,c,d) => a + b + c + d;
var newFn = partialLeft(myfn2, 'a', 'z', 'i');
newFn('z');

thread(
  {a: 1},
  partialLeft(assoc, 'b', 1),
  partialLeft(assocIn, ['foo', 'abr'], '200')
); // { a: 1, b: 1, foo: { abr: '200' } }

```

#### thread
thread first `->` 
thread last `->>` with partial left 

```js path=dist/core.js
function thread(val, ...forms) {
  return forms.reduce((acc, form) => {
    //let fn = partialRight(form);
    let fn = form;
    return fn(acc);    
  }, val);                     
}
```

usage: 
```js path=dist/test.core.js
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

```

#### threadLast
```js path=dist/core.js

function threadLast(val, ...forms){
  return forms.reduce((acc, form) => {
    let [fn, ...rest] = form;
    if(rest && rest.length > 0){
      let fns = partialRight(fn, ...rest);
      return fns(acc);      
    }else{
      return fn(acc);      
    }
  }, val);
}

```

usage:
```js path=dist/test.core.js
var incr = (a) => a + 1;

threadLast(
  {a: 1},
  [seq]
)

threadLast(
  [11],
  [map, (x) => x * 7]
)

```


#### threadFirst 
```js path=dist/core.js

function threadFirst(val, ...forms){
  return forms.reduce((acc, form) => {
    let [fn, ...rest] = form;
    if(rest && rest.length > 0){      
      let fns = partialLeft(fn, ...rest);
      return fns(acc);
    }else{
      return fn(acc);
    }
  }, val);
}
```

usage:
```js path=dist/test.core.js
var incr = (a) => a + 1;

threadFirst(
  {a: 1},
  [assoc, "foo", "bar"],
  [assoc, "My", 1]
)

```

#### condThread
```js path=dist/core.js
var condThread = (value, ...conditions) => {
  return conditions.reduce((acc, condition, index, array) => {
    if (index % 2 === 0) { // Check if the current index is even (condition)
      return condition(acc) ? array[index + 1](acc) : acc;
    }
    return acc; // For odd indices (transform functions), do nothing
  }, value);
};
```

usage: 
```js path=dist/test.core.js
condThread(
  5,
  (x) => x > 0, (x) => x * 2,
  (x) => x < 10, (x) => x + 1,
  (x) => x % 2 === 0, (x) => x / 2
);
```

#### doseq 
do sequence 
```js path=dist/core.js
function doseq(coll, fn) {
  for (const item of coll) {
    fn(item);
  }
}
```

usage: 
```js path=dist/test.core.js
doseq([1,2,3,4], (item) => console.log(item));
```

#### condThreadLast (todo)

#### someThreadLast (todo)

#### threadAs (todo)

### Checks

**@zaeny/clojure.core/checks**  all `?` mark questions replace using `is{}`

#### isNotEmpty
`(not-empty coll)`
```js path=dist/core.js

function isNotEmpty(coll) {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length > 0)
  }
  return coll.length > 0;
}

```
usage: 
```js path=dist/test.core.js
isNotEmpty([])
```

#### isEmpty
`(empty coll)`

```js path=dist/core.js

function isEmpty(coll) {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length === 0);
  }
  return coll.length === 0;
}

```
usage: 
```js path=dist/test.core.js
isEmpty([])
```

#### isContains
`(contains? coll key)`

```js path=dist/core.js

function isContains(...args){
  let [coll, key] = args;
  if(args.length === 1) return (keyN) => isContains(coll, keyN);
  if (coll instanceof Map || coll instanceof Set) {
    return coll.has(key);
  } else if (typeof coll === "object"){
    if(Array.isArray(coll)){
      return coll.includes(key);
    }else{
      return Object.prototype.hasOwnProperty.call(coll, key);
    }
  } else if (typeof coll === "string") {
    return coll.includes(key);
  } else {
    return false;
  }
};

```
usage: 
```js path=dist/test.core.js
isContains([1,2,3,4], 2)
isContains({a:1, b:2}, "b")
isContains('foo', 'o')
```

#### isIncludes
```js path=dist/core.js

function isIncludes(...args) {
  let [coll, value] = args;
  if(args.length === 1) return (value) => coll.includes(value);
  return coll.includes(value);
}

```
usage: 
```js path=dist/test.core.js
isIncludes('foo', 'o')
```


#### isZero
```js path=dist/core.js

function isZero(x) {
  return x === 0;
}

```
usage: 
```js path=dist/test.core.js
isZero(0)
```


#### isPos
```js path=dist/core.js

function isPos(x) {
  return x > 0;
}

```
usage: 
```js path=dist/test.core.js
isPos(-1)
```

#### isNeg
```js path=dist/core.js

function isNeg(x) {
  return x < 0;
}

```
usage: 
```js path=dist/test.core.js
isNeg(-1)
```

#### isEven
```js path=dist/core.js

function isEven(x) {
  return x % 2 === 0;
}

```
usage: 
```js path=dist/test.core.js
isEven(0)
```


#### isOdd
```js path=dist/core.js

function isOdd(x) {
  return x % 2 !== 0;
}

```
usage: 
```js path=dist/test.core.js
isOdd(0)
```

#### isInt
```js path=dist/core.js

function isInt(x) {
  return Number.isInteger(x);
}

```
usage: 
```js path=dist/test.core.js
isInt(10)
```


#### isTrue
```js path=dist/core.js

function isTrue(x) {
  return x === true;
}

```
usage: 
```js path=dist/test.core.js
isTrue({})

```

#### isFalse
```js path=dist/core.js
function isFalse(x) {
  return x === false;
}

```
usage: 
```js path=dist/test.core.js
isFalse(false)
```

#### isInstanceOf
```js path=dist/core.js

function isInstanceOf(x, type) {
  return x instanceof type;
}

```
usage: 
```js path=dist/test.core.js
isInstanceOf([],Array);
isInstanceOf([], Object)
```

#### isNil
```js path=dist/core.js

function isNil(x) {
  return x === null;
}

```
usage: 
```js path=dist/test.core.js
isNil(null)
```

#### isSome
```js path=dist/core.js

function isSome(x) {
  return x != null;
}

```
usage: 
```js path=dist/test.core.js
isSome(null)
isSome('a')
isSome(1)
```

#### isFn
```js path=dist/core.js

function isFn(value) {
  return typeof value === 'function';
}

```
usage: 
```js path=dist/test.core.js
isFn(()=>1)
```

#### isBlank
```js path=dist/core.js

function isBlank(value) {
  return typeof value === 'string' && value.trim() === '';
}

```
usage: 
```js path=dist/test.core.js
isBlank("")
isBlank([])
isBlank(null)
isBlank(undefined)
```

#### isArray
```js path=dist/core.js
function isArray(value) {
  return Array.isArray(value);
}
```
usage: 
```js path=dist/test.core.js
isArray([])
```

#### isNumber
```js path=dist/core.js

function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

```
usage: 
```js path=dist/test.core.js
isNumber(1)
```

#### isObject
```js path=dist/core.js
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

```
usage: 
```js path=dist/test.core.js
isObject([])
isObject({})
```

#### isString
```js path=dist/core.js

function isString(value) {
  return typeof value === 'string';
}

```
usage: 
```js path=dist/test.core.js
isString("")
```

#### isIdentical
```js path=dist/core.js

function isIdentical(x, y) {
  return x === y;
}

```
usage: 
```js path=dist/test.core.js
isIdentical(1, 1)
```

#### isEqual
```js path=dist/core.js
function isEqual(a, b) {
  return a === b;
}

```
usage: 
```js path=dist/test.core.js
isEqual('a','a')
```

#### isColl
```js path=dist/core.js

function isColl(value) {  // TODO fix this, add Array check also
  return (value !== null && typeof value === 'object');
}

```
usage: 
```js path=dist/test.core.js
isColl({})
isColl([])
```

#### isNotEqual
```js path=dist/core.js
function isNotEqual(a, b) {
  return a !== b;
}

```
usage: 
```js path=dist/test.core.js
isNotEqual(1,2)
```

#### isGt
```js path=dist/core.js

function isGt(a, b) {
  return a > b;
}

```
usage: 
```js path=dist/test.core.js
isGt(1,2)
```

#### isGte
```js path=dist/core.js

function isGte(a, b) {
  return a >= b;
}

```
usage: 
```js path=dist/test.core.js
isGte(1,2)
```

#### isLt
```js path=dist/core.js

function isLt(a, b) {
  return a < b;
}

```
usage: 
```js path=dist/test.core.js
isLt(1,2)
```

#### isLte
```js path=dist/core.js

function isLte(a, b) {
  return a <= b;
}

```
usage: 
```js path=dist/test.core.js
isLte(1,2)
```

#### isSubset (todo: fix behaviour set)
```js path=dist/core.js

// function isSubset(set1, set2) {
//   for (let item of set1) {
//     if (!set2.has(item)) {
//       return false;
//     }
//   }
//   return true;
// }

```
usage: 
```js path=dist/test.core.js

```

#### isSuperset (todo: fix behaviour set)
```js path=dist/core.js

// function isSuperset(set1, set2) {
//   for (let item of set2) {
//     if (!set1.has(item)) {
//       return false;
//     }
//   }
//   return true;
// }

```
usage: 
```js path=dist/test.core.js

```

#### isDistinct
```js path=dist/core.js

function isDistinct(arr) {
  return arr.length === new Set(arr).size;
}

```
usage: 
```js path=dist/test.core.js
isDistinct([1,2,2])
isDistinct([1,2,3])
```

#### isEveryEven
```js path=dist/core.js
function isEveryEven(arr) {
  return arr.every(num => num % 2 === 0);
}

```
usage: 
```js path=dist/test.core.js
isEveryEven([0, 2])
```

#### isNotEveryEven
```js path=dist/core.js
function isNotEveryEven(arr) {
  return arr.some(num => num % 2 !== 0);
}

```
usage: 
```js path=dist/test.core.js
isNotEveryEven([0,2])
```

#### isNotAnyEven
```js path=dist/core.js
function isNotAnyEven(arr) {
  return !arr.some(num => num % 2 === 0);
}

```
usage: 
```js path=dist/test.core.js
isNotAnyEven([1])
```


#### isDeepEqual
```js path=dist/core.js
function isDeepEqual(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => isDeepEqual(a, b);  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  } else if (typeof a === 'object' && typeof b === 'object') {
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!isDeepEqual(a[key], b[key])) return false;
    }
    return true;
  } else {
    return a === b;
  }
}

```
usage: 
```js path=dist/test.core.js
isDeepEqual({a:1, b:{c:1}}, {a:1, b:{c:1}})
```

### Maths

**@zaeny/clojure.core/maths.js**

#### rand
```js path=dist/core.js
function rand() {
  return Math.random();
}

```
usage: 
```js path=dist/test.core.js
rand()
```

#### randInt
```js path=dist/core.js
function randInt(max=100) {
  return Math.floor(Math.random() * max);
}

```
usage: 
```js path=dist/test.core.js
randInt(5)
```

#### add
```js path=dist/core.js

function add(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => a + b;
  return a + b;
}

```
usage: 
```js path=dist/test.core.js
add(1,2)
```

#### subtract
```js path=dist/core.js
function subtract(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => a - b;
  return a - b;
}

```

usage: 
```js path=dist/test.core.js
subtract(20,10)
```

#### multiply
```js path=dist/core.js

function multiply(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => a * b;
  return a * b;
}

```
usage: 
```js path=dist/test.core.js
multiply(10, 1)
```

#### divide
```js path=dist/core.js
function divide(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => a / b;
  return a / b;
}

```
usage: 
```js path=dist/test.core.js
divide(100, 10)
```


#### quot
```js path=dist/core.js

function quot(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.floor(a / b);
  return Math.floor(a / b);
}

```
usage: 
```js path=dist/test.core.js
quot(100, 3)
```

#### mod
```js path=dist/core.js

function mod(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => a % b;
  return a % b;
}

```
usage: 
```js path=dist/test.core.js
mod(2,2)
mod(1, 2)
mod(1, 3)
```

#### rem
```js path=dist/core.js
function rem(...args) {
  let [a, b] = args;
  if (args.length === 1) return (b) => ((a % b) + b) % b;
  return ((a % b) + b) % b;
}

```

usage: 
```js path=dist/test.core.js
rem(10, 20)
```

#### incr
```js path=dist/core.js
function incr(num) {
  return num + 1;
}

```
usage: 
```js path=dist/test.core.js
incr(10)
```

#### decr
```js path=dist/core.js

function decr(num) {
  return num - 1;
}

```
usage: 
```js path=dist/test.core.js
decr(10)
```

#### max
```js path=dist/core.js
function max(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.max(a, b);  
  return Math.max(a, b);
}

```

usage: 
```js path=dist/test.core.js
max(0, 100)
```

#### min
```js path=dist/core.js
function min(...args) {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.min(a, b);
  return Math.min(a, b);
}

```
usage: 
```js path=dist/test.core.js
min(0, 20)
```

#### toInt
```js path=dist/core.js
function toInt(num) {
  return parseInt(num);
}

```
usage: 
```js path=dist/test.core.js
toInt("100")
toInt(100)
```

#### toIntSafe
```js path=dist/core.js

function toIntSafe(num) {
  return parseInt(num.toString());
}

```
usage: 
```js path=dist/test.core.js
toIntSafe(10)
```

### String

**@zaeny/clojure.core/strings**

#### subs
```js path=dist/core.js

function subs(...args) {
  let [str, start, end] = subs;
  if(args.length === 1) return (start, end) => str.substring(start, end);
  return str.substring(start, end);
}

```
usage: 
```js path=dist/test.core.js
subs("foo", 0, 2); //fo
```

#### splitLines
```js path=dist/core.js

function splitLines(str) {
  return str.split("\n");
}

```
usage: 
```js path=dist/test.core.js
 splitLines("hello\nworld"); // ["hello", "world"]
```

#### replace
```js path=dist/core.js

function replace(...args) {
  let [str, pattern, replacement] = args;
  if(args.length === 1) return (pattern, replacement) => str.replace(pattern, replacement);
  return str.replace(new RegExp(pattern, "g"), replacement);
}

```

usage: 
```js path=dist/test.core.js
replace("hello world", "o", "a"); // "hella warld"
```

#### replaceFirst
```js path=dist/core.js
function replaceFirst(...args) {
  let [str, pattern, replacement] = args;
  if(args.length === 1) return (pattern, replacement) => str.replace(pattern, replacement);
  return str.replace(pattern, replacement);
}
```

usage: 
```js path=dist/test.core.js
replaceFirst("hello world", "o", "a"); // "hella world"
```

#### join
```js path=dist/core.js

function join(...args) {
  let [arr, separator] = args;
  if(args.length === 1) return (separator) => arr.join(separator);
  return arr.join(separator);
}

```
usage: 
```js path=dist/test.core.js
join(["hello", "world"], " "); // "hello world"
```

#### escape
```js path=dist/core.js

function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

```
usage: 
```js path=dist/test.core.js
escape("hello.world"); // "hello\.world"
```

#### rePattern
```js path=dist/core.js

function rePattern(pattern) {
  return new RegExp(pattern);
}

```
usage: 
```js path=dist/test.core.js
rePattern("hello.*");
```

#### reMatches
```js path=dist/core.js
function reMatches(...args) {
  let [str, pattern] = args;
  if(args.length === 1) return (pattern) => reMatches(str, pattern);
  var regex = new RegExp(pattern, "g");
  var matches = [];
  var match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

```
usage: 
```js path=dist/test.core.js
reMatches("hello world", "l+"); // ["ll"]
```

#### capitalize
```js path=dist/core.js

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

```
usage: 
```js path=dist/test.core.js
capitalize("hello world"); // "Hello world"
```


#### lowerCase
```js path=dist/core.js

function lowerCase(str) {
  return str.toLowerCase();
}

```
usage: 
```js path=dist/test.core.js
lowerCase("HELLO WORLD"); // "hello world"
```

#### upperCase
```js path=dist/core.js

function upperCase(str) {
  return str.toUpperCase();
}

```

usage: 
```js path=dist/test.core.js
upperCase("hello world"); // "HELLO WORLD"
```

#### trim
```js path=dist/core.js

function trim(str) {
  return str.trim();
}

```
usage: 
```js path=dist/test.core.js
trim("   hello world   "); // "hello world"
```

#### trimNewLine
```js path=dist/core.js

function trimNewLine(str) {
  return str.replace(/^[\n\r]+|[\n\r]+$/g, '');
}

```
usage: 
```js path=dist/test.core.js
trimNewLine('\nhello\nworld\n')
```

#### trimL
```js path=dist/core.js

function trimL(str) {
  return str.replace(/^\s+/, '');
}

```
usage: 
```js path=dist/test.core.js
trimL('\nfoo')
```
#### trimR
```js path=dist/core.js

function trimR(str) {
  return str.replace(/\s+$/, '');
}

```
usage: 
```js path=dist/test.core.js
trimR('foo\n')
```

#### char
```js path=dist/core.js

function char(n) {
  return String.fromCharCode(n);
}

```

usage: 
```js path=dist/test.core.js
char(56);
```

### Atom
**@zaeny/clojure.core/atom**

#### atom
```js path=dist/core.js

function atom(initialValue) {
  let state = initialValue;
  let watchers = {};
  let validator = null;

  function deref() {
    return state;
  }

  function reset(newValue) {
    const oldState = state;
    const validatedValue = validate(newValue);
    state = validatedValue;
    notifyWatchers(oldState, state);
    return state === validatedValue; // Return true if the value passed validation
  }

  function swap(updateFn) {
    const oldValue = state;
    const newValue = updateFn(state);
    const validatedValue = validate(newValue);
    state = validatedValue;
    notifyWatchers(oldValue, state);
    return state === validatedValue; // Return true if the value passed validation
  }

  function addWatch(name, watcherFn) {
    watchers[name] = watcherFn;
  }

  function removeWatch(name) {
    delete watchers[name];
  }

  function notifyWatchers(oldState, newState) {
    for (const watcherName in watchers) {
      if (watchers.hasOwnProperty(watcherName)) {
        watchers[watcherName](oldState, newState);
      }
    }
  }

  function compareAndSet(expectedValue, newValue) {
    if (state === expectedValue) {
      const validatedValue = validate(newValue);
      state = validatedValue;
      notifyWatchers(expectedValue, state);
      return state === validatedValue; // Return true if the value passed validation
    }
    return false;
  }

  function setValidator(validatorFn) {
    validator = validatorFn;
  }

  function removeValidator() {
    validator = null;
  }
  
  function validate(newValue) {
    const defaultValidation = validator ? validator(newValue) : true;
    return defaultValidation ? newValue : state; // Return current state if validation fails
  }

  return {
    deref,
    reset,
    swap,
    addWatch,
    removeWatch,
    compareAndSet,
    setValidator,
    removeValidator
  };
}
```

#### deref
```js path=dist/core.js
function deref(atom){
  return atom.deref();
}
```

usage: 
```js path/dist/test.core.js
deref(s);
```

#### reset
```js path=dist/core.js
function reset(...args){
  let [atom, value] = args
  if(args.length === 1) return (value) => atom.reset(value);
  atom.reset(value);
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
reset(s, 100);
```

#### swap
```js path=dist/core.js
function swap(...args){
  let [atom, fn, ...rest] = args;
  if(args.length === 1) return (fn, ...rest) => atom.swap(fn, ...rest);
  atom.swap(fn, ...args);
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
swap(s, (n)=> n - 10)
```

#### compareAndSet
```js path=dist/core.js
function compareAndSet(...args){
  let [atom, expected, newVal] = args;
  if(args.length === 1) return (expected, newVal) => atom.compareAndSet(expected, newVal);  
  atom.compareAndSet(expected, newVal);
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
compareAndSet(s, 90, 200)
deref(s);
```

#### addWatch
```js path=dist/core.js
function addWatch(...args){
  let [atom, name, watcherFn] = args;
  if(args.length === 1) return (name, watcherFn) => atom.addWatch(name, watcherFn);
  atom.addWatch(name, watcherFn);
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
addWatch(s, 'foo', (n, o) => console.log(n,o));
reset(s, 100);
```

#### removeWatch 
```js path=dist/core.js
function removeWatch(...args){
  let [atom, watcherFn] = args;
  if(args.length === 1) return (watcherFn) => atom.removeWatch(watcherFn);
  atom.removeWatch(watcherFn);
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
removeWatch(s, "foo");
```

#### setValidator
```js path=dist/core.js
function setValidator(...args){
  let [atom, validatorFn] = args;
  if(args.length === 1) return (validatorFn) => atom.setValidator(validatorFn);
  atom.setValidator(validatorFn);
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
setValidator(s, (n)=> n >0);
reset(s, 100)
reset(s, 0)
s.deref()
```

#### removeValidator
```js path=dist/core.js

function removeValidator(atom){
  atom.removeValidator();
  return atom.deref();
}
```

usage: 
```js path=dist/test.core.js
removeValidator(s)
```

usage: test direct

```js path=dist/test.core.js
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
```


### Multi method
**@zaeny/clojure.core/multi-method**

#### defmulti (todo: fix this)
```js path=dist/core.js

function defMulti(dispatchFn) {
  const methods = [];

  function multiFn(...args) {
    const dispatchValue = dispatchFn(...args);
    const dispatchIndex = methods.findIndex(method => method.dispatchValue === dispatchValue);

    if (dispatchIndex < 0) {
      throw new Error(`No method defined for dispatch value: ${dispatchValue}`);
    }

    const dispatchFn = methods[dispatchIndex].methodFn;

    return dispatchFn(...args);
  }

  return multiFn;
}

```
usage: 
```js path=dist/test.core.js

var greetings = defMulti((x) => get(x, "langauge"))

```

#### defmethod (todo: fix this)
```js path=dist/core.js

function defMethod(multiFn, dispatchValue, methodFn) {
  multiFn.methods.push({ dispatchValue, methodFn });
}

```
usage: 
```js path=dist/test.core.js
defMethod(greetings, "English", (params) => "Hello")
```

### Transducer
**@zaeny/clojure.core/transducer**

#### (todo)

```js evaluate=0
// TODO: still testing
function transduce(xform, f, coll) {
  const xf = xform(f);
  let result = xf[init]();

  for (const item of coll) {
    const res = xf[step](result, item);
    if (res && res['@@transducer/reduced']) {
      result = res['@@transducer/value'];
      break;
    } else {
      result = res;
    }
  }

  return xf[completion](result);
}

function dedupe() {
  const seen = new Set();
  return (f) => ({
    ['@@transducer/init']: f[init],
    ['@@transducer/step']: (result, item) => {
      if (seen.has(item)) {
        return result;
      }
      seen.add(item);
      return f[step](result, item);
    },
    ['@@transducer/completion']: f[completion]
  });
}

const arr = [1, 2, 3, 3, 4, 5];
const sum = (acc, val) => acc + val;
const double = (val) => val * 2;
const takeWhile = (pred) => (f) => ({
  ['@@transducer/init']: f[init],
  ['@@transducer/step']: (result, item) => pred(item) ? f[step](result, item) : result,
  ['@@transducer/completion']: f[completion]
});

const push = (acc, val) => {
  acc.push(val);
  return acc;
};


const res = transduce(
  compose(takeWhile((val) => val < 5), dedupe(), map(double)),
  sum,
  arr
);
console.log(res); // Output: 10

const map = f => xf => (reducer) => {
  return xf((acc, x) => reducer(acc, f(x)))
}

const filter = pred => xf => (reducer) => {
  return xf((acc, x) => pred(x) ? reducer(acc, x) : acc)
}

const transducer = compose(
  map(x => x * 2),
  filter(x => x % 2 === 0)
)
const arr = [1, 2, 3, 4, 5]
const doubledEvens = transduce(transducer, push(), arr)
console.log(doubledEvens) // [4, 8]

const arr = [1, 2, 3, 4, 5]
const sumOfDoubledEvens = transduce(
  transducer,
  (acc, x) => acc + x,
  0,
  arr
)
console.log(sumOfDoubledEvens) // 12

```

export all function
```js path=dist/core.js

module.exports = {
    // object,
  get, getIn, assoc, dissoc, update, assocIn, updateIn, merge, mergeWith, selectKeys, renameKeys, keys, vals, zipmap,
  // collections
  count, conj, cons, first, ffirst, nth, seq, peek, rest, pop, disj, takeNth, take, second, last, next, fnext, takeLast, takeWhile, distinct, 
  nthrest, drop, dropLast, splitAt, shuffle, randNth, vec, subvec, repeat, range, keep, keepIndexed, sort, sortBy, compare, nfirst, nnext,
  map, filter, reduce, find,every, remove, concat, mapcat, mapIndexed, flatten, interleave, interpose, reverse, groupBy, partition, partitionAll, partitionBy,
  frequencies, union, difference, intersection,
  into,
  // functions
  apply, comp, constantly, identity, fnil, memoize, everyPred, complement, partial, juxt, someFn, partialRight, partialLeft, thread, condThread, threadFirst, threadLast, doseq,
  // checks
  isNotEmpty, isEmpty, isContains, isIncludes, isIncludes, isZero, isPos, isNeg, isEven, isOdd, isInt, isTrue, isFalse, isInstanceOf, isSome, isFn, isDeepEqual, isNil,
  isBlank, isArray, isObject, isNumber, isString, isIdentical, isEqual, isNotEqual, isGt, isGte, isLt, isLte, isDistinct, isEveryEven, isNotEveryEven, isNotAnyEven, isColl,
  // maths
  rand, randInt, add, subtract, multiply, divide, quot, mod, rem, incr, decr, max, min, toInt, toIntSafe,
  // strings
  subs, splitLines, replace, replaceFirst, join, escape, rePattern, reMatches, capitalize, lowerCase, upperCase, trim, trimNewLine, trimL, trimR, char,
  // state
  atom, deref, reset, swap, addWatch, removeWatch, setValidator, compareAndSet, removeValidator,
  // mutli method  
}

```

index 

```js path=dist/index.js
module.exports = Object.assign({}, require('./core'));
```
