# Parser
Ah. The brains behind the whole deriver project. This handy function turns strings into `Tree`s. This is the glue between user input and everything we just discussed. First, input is cleaned. That just means multiplication signs are added so the parser does not get confused. That is the `cleanInput` method. The `parseInput` method is what you really wanna see.

## Helper Methods
### replaceNegatives(val)
How do you tell the difference between a subtraction sign and a negative sign? Well, it depends on what character is directly to the left of it. For example, "3+-4". `-` located at index 2, and the previous token (character) is a `+`. So that means it is a negative sign.

This method pretty much goes through that logic and replaces every negative sign with a tilda (`~`).

### parseParens(val)
An initial concern when making this project was how to deal with parentheses. Parentheses can be nested, so how can you derive something if you cannot tell where the parentheses begin and end? This method helps that by locating the beginning and end of the parentheses. The algorithm is pretty dope, not going to lie, and I recommend checking it out.
#### Example
```javascript
parseParens('2+(3-4)') // [[2,6]]
parseParens('2+(3-4)+(9-4)') // [[2,6], [8, 12]]
parseParens('1+((2+3)*(4+5))') // [[2,14], [3, 7], [9,13]]
```
So it returns an array, and each element in the array is an array the gives the range of the parentheses.

### cleanInput(val)
This function may be more complex than the parseInput method actually. In addition to inserting multiplication symbols, it also adds parentheses to functions like sine and cosine. This is where all those `__string` helper methods come in handy.
#### Example
```javascript
cleanInput('2x') // 2*x
cleanInput('3(2+5)') // 2*(2+5)
cleanInput('(8+4)(1+4)') // (8+4)*(1+4)

cleanInput("sin2x") // sin(2*x)
cleanInput("sincosx") // sin(cosx)
cleanInput("sinxcosx") // sin(x)*cos(x)
```

## parseInput(val)
The meat and potatoes. In short, all this really does is recursively make a `Tree`. It makes the val of the tree equal to the operator with the highest precedence (so backwards PEMDAS order), and the left side of the tree is everything to the left of the operator parsed and same with the right. It will make more sense as we go on. I suggest reading through this real quick with the code next to it, and then go through an example and then reread. It is actually pretty simple once you look at an example.

### Base Case \#1
If val is an empty string, we return to break out of the string.

### Dealing with Parentheses
The code from the declaration of `parens` to the declaration of `foundOps`

The variable `org` is defined to hold a copy of the whatever was in val. We are going to replace everything in parentheses with underscores so that the parser can focus on the operators. (It will make sense).

If val is wrapped in parentheses (for example, val = `(2x+5)`), we are going to remove those parentheses, so val will be `2x+5`.

So `(2x+5)*2` will be converted to `______*2`, but the variable `org` will hold `(2x+5)*2` still.

### Finding Operators
The code from declaration of `foundOps` to declaration of `pos`.

Quickly practice converting a string input into a Tree. `(2x+5)*2`. The first node will be `*`. The left will be a `+` and the right a `2`... And so on. If you do not understand this, go back and try realizing that. Realizing how to convert them into trees by hand is integral (lol, integrals). Making a computer do it is cool.

We loop through each character in the string, but in reverse order. Ill explain why soon.

For each character, we look through and check if the current character is equal to any operator. (This includes stuff like sin and cosine. OP usually means just +-/\*, which can get confusing). If the current character is equal to an operator, it is added to the foundOps object as a key, and its position as the value.

### Choosing the Operator with the lowest Precedence
So `foundOps` has all the locations of the operators in `val`. We want the top node to be equal to the operator with the lowest precedence. For ex, `2*4+4`. The top of the tree would be the `+`.

`TreePattern.OPS` is arranged in order of precedence. The for loop under the declaration of `pos` and `token` loops through and if the operator is in val, it sets `pos` to be the position of the operator and `token` to be whatever the token was. It then breaks, because we now know what the value of the tree we are making is going to be. The reason we went across val in backwards order deals with the fact that PEMDAS can also be PEDMSA. For example, `2+4+5`. This is read left to right. So the top of the left of the tree should be 2, and the right should be 4+5. By traversing in backwards order, we overwrite the operator in `foundOps` to be the leftmost position in val, if that operator was found.

### Recursion Bro!
So we have a position, and the token. Now, we just make a new `Tree` with that token, and then set the left of the tree to be the `Tree` returned from parsing the left of the operator, and the right side to be from parsing the string from the right of the operator.

### Base Case \#2
If `pos` is undefined though, that means that no operators were found. This means we have found the end of `Tree`. If val is a `TreePattern` rule, we set it to one. Otherwise, we make a number, replacing those `~`s back to negative signs so it can be evalutated as a negative number.


## Example

| 3 | * | x | ^ | 5 | + | 4 | * | x |
|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |

```javascript
var foundOps = {
  '*': 1,
  '+': 5,
  '^': 3
}
```
By going through the string in reverse order, the operator that is saved is always the left most one. In this example, it is `'*': 1` rather than `'*': 7`.

We have a nested for loop that loops through `TreePattern.OPS`  (which has all the operators in order) and `foundOps` . Here is a short segment of `TreePattern.OPS`.
```javascript
TreePattern.OPS = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    'arcsin': 4,
    ... // etc
}
```
If a value in `TreePattern.OPS` is within `foundOps`, we set `pos` and `token` and break out of the `for` loop.

In this example, `pos=5`,because that is where the `+` was, and `token='+'`. 

We create a new Tree with `token` as the value, and then set the left side of tree to `parseInput('3*x^5')` and the right to `parseInput('4*x')`. Since `parseInput` will either return a `Tree` or `false`, this will correctly create a Tree.

Here is the order of what will be called.
```javascript
parseInput("3*x^5+3*x")
/**/parseInput("3*x^5")
/****/parseInput("3")
/****/parseInput("x^5")
/******/parseInput("5")
/**/parseInput("3*x")
/****/parseInput("3")
/******/parseInput("x")
```
When `parseInput("3")` is called, it is essentially returning `new Tree("3")`. If we loop through all the `TreePattern.OPS` and there are no matches in `foundOps`, then `pos` stays undefined. Then we just return `new Tree(val)`.
