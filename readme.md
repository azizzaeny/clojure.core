## @zaeny/clojure.core

[![npm version](https://img.shields.io/npm/v/@zaeny/clojure.core.svg)](https://www.npmjs.com/package/@zaeny/clojure.core)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/clojure.core.svg)  

> Clojure core functions in javascript land    


An attempt to port clojure core library function so it available in javascript to be use.   


- [Getting Startd](#getting-started)  
- [Usage](#usage) and pattern
- [Rational](#Rational) and a problem to solve
- [Documentation](#documentation)
- [Development](#development)

### Getting Started  
 ``` 
 npm install @zaeny/clojure.core 
 ``` 
**CommonJS**
```js 
var {get, getIn} = require("@zaeny/clojure.core");  
```
**ES6**
```js
import {peek, assoc} from "@zaeny/clojure.core";
```
**CDN Import to Browser**
```js
<script src="https://cdn.jsdelivr.net/npm/@zaeny/clojure.core"></script>
```   
**Browser import**
```js
import {updateIn} from ' https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/+esm';
```
**ES5 export (load non default file)**
```js 
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.js
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.min.js
```
the  use it   

### Usage
see documentation bellow 

```js
getIn({a: {b: {c: 1}}}, ['a', 'b', 'c']); // 1
assoc({a:1};, 'b', 20); //  {a:1,b:20}
assocIn({a: 1, b:{c: 10}};, ['b', 'c'], 20)
peek([1,2,3,4]); // 4
rest([1,2,3]); // [2,3]
remove(isEven, [1, 2, 3, 4, 5, 6]); //[1,3,5]
reduce((acc,v) => acc + v, 0, [1, 23,4,5,6,77]); // 116
mapcat(x => [x, x * 2], [1,2,3,4]); // [1,2,2,4,3,6,4,8]
mapIndexed((n, i) => [n, i], [1,2,3,4,5]); // [ [ 1, 0 ], [ 2, 1 ], [ 3, 2 ], [ 4, 3 ], [ 5, 4]]
interleave([1,2,3], ["a", "b","c"]) // [1, 'a', 2, 'b', 3, 'c']
zipmap([1,2,3], ["a", "b","c"]); // { '1': 'a', '2': 'b', '3': 'c' }
interpose(",", ["one", "two", "three"]) // [ 'one', ',', 'two', ',', 'three' ]
map(identity, [1,2,3,4,5,6]) //[1,2,3,4,5,6]
apply(get, [ {a: 1}, "a" ]) // 1
juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]
frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]); // { '1': 3, '2': 3, '3': 1, '4': 1, '5': 1, '6':1, '7': 1, '8': 2 }
union([1,2,3,4,5], [1,2,3,8,9]); // [1,2,3,4,5,8,9]
threadLast([22], [map, (x) => x * 10]); // [220]
threadFirst({a: 11}, [assoc,"b", "22"]) // {a: 11, b: 22}
comp(addTwo, square, doubleIt);
```
   
###  Rationale
**A Problem to solve**   
As a Software Engineer, there are several scenarios where we cannot be selective about certain development methods, ideas, and programming paradigms that we typically utilize in our daily work. For instance:  

- You have recently joined an established team of developers who predominantly employ object-oriented programming, making it challenging to immediately introduce and integrate functional programming techniques.  
- You are a third-party developer tasked with resolving issues in the production code of an existing development team, but you are unable to transition the entire codebase to Clojure.  
- Despite your personal experience and preference for Clojure development, your team primarily works with JavaScript, and you encounter resistance when advocating for a transition to Clojure.  

Having encountered these challenges myself, I believe that providing access to the Clojure.core library or translating its functionalities to JavaScript can be beneficial for individuals facing similar dilemmas.   
This approach enables the utilization of functional programming paradigms inherent in Clojure within the JavaScript ecosystem, thereby addressing the needs of those who wish to leverage Clojure's functional programming capabilities while adhering to JavaScript syntax conventions.

TODO: explain better
 - why clojure?  rich library functions, naming conventions of functions
 - Thinking in clojure and functional programming
 - Difference from mori and clojurescript
 - Naming convention from clojure 


### Documentation and supported functions
Current status all supported functions see [core.md](./core.md). 


### Development and contribution
To update the code first you need to extract it from `core.md` 

**Extracting codes**
```sh
./build core.md
```

publishing npm

```sh
npm version
npm publish
```


### Changes
 - [1.0.1] add atom functions `reset, swap, compareAndSet, addWatch, removeWatch, setValidator`
 - [1.0.2] fix Readme.md
 - [1.1.0] add `threadLast, threadFirst`, fix function arity `atom` `string` and `math`
 - [1.1.3] fix arguments of function check of all object `assoc`, `update`, `updateIn` etc
