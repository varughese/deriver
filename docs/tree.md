# Tree
The Tree class is fundamental to the project. It's methods allow for easy manipulation.

### getDir()
#### Description
This method is used to convert dir into 'left' or 'right'. It allows for other functions to pass in positive numbers or negative numbers to indicate right or left.
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| dir |  A number or string that indicates left or right | `-1`, `'left'`, `1`, `'right'` |
### Example
```javascript
getDir(1) // right
getDir(-1) // left
getDir('right') // right
getDir('left') // left
```


### add()
#### Description
This method is used to convert dir into 'left' or 'right'. It allows for other functions to pass in positive numbers or negative numbers to indicate right or left.
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| dir |  A number or string that indicates left or right | `-1`, `'left'`, `1`, `'right'` |
| val | The value that should be added | `'+'`, `'-'`, `4`, `'sin'` |
### Example
```javascript
var tree = new Tree('*');
/*
[*]
*/
tree.add('left', 2);
/*
[*]
..[2]
*/
tree.add('right', 4);
/*
[*]
..[2]
..[4]
*/
```
It is essentially the same as doing the following
```javascript
var tree = new Tree('*');
tree.left = new Tree(2);
tree.right = new Tree(4);
```
However, it detects whether or not you pass in a Tree. This comes in handy if the value you pass will either be a `Tree` or a basic value.
```javascript
/* The following makes this tree:
[*]
..[+]
....[1]
....[1]
..[4]
*/
var tree = new Tree('*');

var otherTree = new Tree('+');
otherTree.add('left', 1);
otherTree.add('right', 1);

tree.l(otherTree)
tree.r(4);

// instead of
var tree = new Tree('*');

var otherTree = new Tree('+');
otherTree.left = new Tree(1);
otherTree.right = new Tree(1);

tree.left = otherTree;
tree.right = new Tree(4);
```
It is all just syntatical sugar for manipulating the left and right values of the trees!

### r()
#### Description
Shortcut for add('right', val)
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| v | The value that should be added | `'+'`, `'-'`, `4`, `'sin'` |
### Example
```javascript
var tree = new Tree('*');
tree.add('left', 2);
tree.r(4);
/*
[*]
..[2]
..[4]
*/
```


### l()
#### Description
Shortcut for add('left', val)
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| v | The value that should be added | `'+'`, `'-'`, `4`, `'sin'` |
### Example
```javascript
var tree = new Tree('*');
tree.l(2);
tree.add('right', 4);
/*
[*]
..[2]
..[4]
*/
```


### equals()
#### Description
Recursively checks if two trees are equal. Uses TreePattern.eq to check equality, so this method is compatible with TreePattern trees.
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| tree | Another Tree object | `{val: '+', left: '2', right:'4'}` |
### Example
```javascript
/* Tree A
[*]
..[2]
..[4]
*/
/* Tree B
[*]
..[2]
..[4]
*/
/* Tree C
[*]
..[12]
..[4]
*/
A.equals(B) // true
B.equals(A) // true
A.equals(C) // false
```


### clone()
#### Description
Returns a copy of the tree.
### Example
```javascript
/* Tree A
[*]
..[2]
..[4]
*/
var B = A
A.left.val // 2
B.left.val // 2
B.left.val = 3
/* Tree A is now
[*]
..[3]
..[4]
*/
```
With clone however,
```javascript
/* Tree A
[*]
..[2]
..[4]
*/
var B = A.clone()
A.left.val // 2
B.left.val // 2
B.left.val = 3
/* Tree A is still
[*]
..[2]
..[4]

But Tree B has changed! */
```


### switch()
#### Description
Switches the left and right branch.
### Example
```javascript
/* Tree A
[+]
..[2]
..[x]
*/
A.switch()
/* A is now
[+]
..[x]
..[2]
*/
```


### contains()
#### Description
Recursively checks if a target value is within a tree. Uses TreePattern.eq to check, so it is compatible with TreePattern rules.
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| target | A value to be searched for | `sin`, `TreePattern.NUM` |
### Example
```javascript
/* Tree A
[+]
..[2]
..[x]
*/
A.contains(2) // true
A.contains('sin') //false
```


### replace()
#### Description
Recursively replaces a target value with a replace value everywhere in the tree.
#### Params
| Name  | Description | Ex |
|-------|-------------|----|
| target | A value to be searched for | `TreePattern.MARKER`, `TreePattern.NUM`, `x` |
| replace | Replace value | `cos`, `1`, `{val: '+', left: '2', right:'4'}`|
### Example
```javascript
/* Tree A
[+]
..[*]
....[4]
....[x]
..[x]
*/
/* Tree B
[+]
..[2]
..[3]
*/
A.replace('x', B);
/* Tree A is now
[+]
..[*]
....[4]
....[+]
......[2]
......[3]
..[+]
....[2]
....[3]
*/
```


### toString()
#### Description
Overrides default toString method, which allows for easy debugging to view a tree.
### Example
```javascript
var tree = new Tree('+');
var leftSubTree = new Tree('*');
leftSubTree.l(4);
var subSubTree = new Tree('+');
subSubTree.l(2);
subSubTree.r(3);
leftSubTree.r(subSubTree);
var rightSubTree = new Tree('+');
rightSubTree.l(2);
rightSubTree.r(3);
tree.l(leftSubTree);
tree.r(rightSubTree);
var x = tree.toString()
// or var x = tree + "";
/* x:
[+]
..[*]
....[4]
....[+]
......[2]
......[3]
..[+]
....[2]
....[3]
*/
```


### toFlatString()
#### Description
A more compact version of toString() that displays everything on a single line.
### Example
```javascript
var tree = new Tree('+');
var leftSubTree = new Tree('*');
leftSubTree.l(4);
var subSubTree = new Tree('+');
subSubTree.l(2);
subSubTree.r(3);
leftSubTree.r(subSubTree);
var rightSubTree = new Tree('+');
rightSubTree.l(2);
rightSubTree.r(3);
tree.l(leftSubTree);
tree.r(rightSubTree);
var x = tree.toFlatString() // "4*2+3+2+3"
```
