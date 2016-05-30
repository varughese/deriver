# TreePattern
Probably the most poorly worded class, with some poorly worded methods. However, this contraption is what allows for simplification and other checks of equality and such!

## treePatternRule
All this is a constructor to make an object that contains the identifier for a rule. It needs to be an object so it is passed around as a reference. By making it its own class, it is able to have a toString method, which makes it compatible with a `Tree` if it is stringified in that.

## Rules
Different treePatternRule objects can be found as properties on the `TreePattern` class. For example, TreePattern.NUM refers to any value that is a number. The reason for these rules is to allow for different patterns to be made. For example...
```javascript
/* Tree A
[*]
..[+]
....[1]
....[1]
..[4]
*/
/* Pattern A
[*]
..[+]
....[###]
....[###]
..[###]
*/
```
Pattern A follows the pattern of a (Number plus a Number) times a Number. More succinctly written as (###+###)\*(###). Tree A matches this pattern. Does `(2+x)*9` match Pattern A? No. TreePattern rules are ways that allow this idea of a pattern to be implemented in this project. The rules are self-explanatory and easily extensible.

#### $$$ : TreePattern.ANY
Any value at all!

#### ### : TreePattern.NUM
Any number at all! Can also be a fraction, like 1/3.

#### &&& : TreePattern.OP
Any operator, such as +, -, \*, ^.

#### >>> : TreePattern.TRIG
Cosine, sine, arcsine, all the dreaded trigonometric functions.

#### @@@ : TreePattern.MARKER
A Marker, which goes hand in hand with `Tree.replace`. Usually, these markers are parsed and then replaced with other Trees. Check out the `trigRules` to see it in action.

## More Properties

### \_\_OPS
A hash table (hash table: an object with key value pairs) that contains all the operators. They are in backwards PEMDAS order for a reason. The parser method uses this object and loops through the keys. The keys that are found last are the ones that denote the highest level. The numbers next to each key denote precedence, which is used in the `unparser`, but not that important otherwise.
### \_\_FUNCTIONS
A hash table (hash table: an object with key value pairs) that contains all the functions. See above for explanation.
### checkMultiply
The `cleanInput` method uses the characters in this array to check where it needs to insert a multiplication symbol.
### checkParens
The `cleanInput` method uses the characters in this array to check where it needs to insert a parenthesis.

## Equals method
`TreePattern.eq` is a helper method that is used to check equality between two values. It is very convenient and made to work well with the aforementioned rules! It also uses clever use of `TreePattern.fns` to evalutate equality without using a mess of if statements. I recommend looking through the code to see how this works.
### Example
```javascript
var x = 2;
TreePattern.eq(x, TreePattern.NUM) // true
TreePattern.eq('2', TreePattern.NUM) // true
TreePattern.eq('2', TreePattern.OP) // false
TreePattern.eq('sin', TreePattern.TRIG) // true
```
Pretend we have the Tree for 1/4. Technically, this is a number. Without TreePattern, complex logic would have to be placed and repeated in other methods to check for a number. With this setup, it is just in one area. Heres what I mean:
```javascript
var fraction = new Tree('/');
fraction.l(1);
fraction.r(4);
/* fraction:
[/]
..[1]
..[4]
*/
TreePattern.eq(fraction, TreePattern.NUM) // true
```
Without this method, checking if variables like `fraction` were a number would be a pain!
