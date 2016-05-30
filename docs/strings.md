# Helpful String Methods
Since the input comes in as a string, some string manipulation is inevitable to allow the strings to be converted into `Tree`s. All of these are called by `__strings.methodName.call(val, arg1, arg2)`. Examples are worth a million words, so none of that mumbo jumbo descriptions of parameter junk here. None of these change the original string however, so remember that.

### splice(start, newSubStr)
#### Example
```javascript
var str = "heo";
var newStr = __strings.splice.call(str, 2, "ll");
// hello
```

### cut(start, end)
#### Example
```javascript
var str = "hellmofoso";
var newStr = __strings.cut.call(str, 4, 8);
// hello
```

### replaceAt(index, char)
#### Example
```javascript
var str = "hallo";
var newStr = __strings.replaceAt.call(str, 1, 'e');
// hello
```

### findChar(index, char) *Should be renamed to findStr or something*
#### Example
```javascript
var str = "hello";
var indexes = __strings.replaceAt.call(str, 'l') // [2,3]
```

### removeSpaces()
#### Example
```javascript
var str = "   h e  l   l    o";
var newStr = __strings.removeSpaces.call(str) 
// hello
```
