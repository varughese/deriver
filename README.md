![alt text](http://i.imgur.com/3BcEYvK.png "Deriver")

[![Build Status](https://travis-ci.org/jasonawalker/deriver.svg?branch=master)](https://travis-ci.org/jasonawalker/deriver)

# Link to View
A Github-Pages link was made to show this off (it includes cool visuals as well). Check out the `gh-pages` branch, or **click this [link](http://varughese.github.io/deriver/)**

# How to Use
Grab the deriver.js file from `dist` folder to get the latest version.
``` javascript
Deriver.derive("3x^2+3")  // 6x
Deriver.derive("tan2x+sinx") // 2sec(2x)^2+cosx
```

# How it Works
![alt text](http://i.imgur.com/fgDaruC.png?1)

An input is given as a string. This string is "cleaned", which inserts multiplication symbols where neccesary. For example, 2\*x is usually written by 2x. And sin(2\*x) is usually written as sin(2x). The cleaned input is parsed into a Tree. The root of a tree is a value. The root of the parsed tree in this example is a '+' operator. The left and right branches of a tree are also Trees. Computers are much better at understanding trees than understanding strings. This makes manipulation a lot easier. This tree is then derived. All of the derivative rules are programmed in, and the derive method follows them. The result is a tree, which is then simplified and then unparsed from a tree back to a string!

To view the individual functions
- [cleanInput](https://github.com/jasonawalker/deriver/blob/master/src/parser.js#L28)
- [parseInput](https://github.com/jasonawalker/deriver/blob/master/src/parser.js#L97)
- [derive](https://github.com/jasonawalker/deriver/blob/master/src/deriver.js)
- [simplify](https://github.com/jasonawalker/deriver/blob/master/src/simplifier.js)
- [unparse](https://github.com/jasonawalker/deriver/blob/master/src/unparser.js)

I recommend reading through the docs in this order though:
 1. [Tree](https://github.com/jasonawalker/deriver/blob/master/docs/tree.md)
 2. [TreePattern](https://github.com/jasonawalker/deriver/blob/master/docs/treepattern.md)
 3. [Strings](https://github.com/jasonawalker/deriver/blob/master/docs/strings.md)
 4. [Parser](https://github.com/jasonawalker/deriver/blob/master/docs/parser.md)

## Original Concerns
- How to manage parentheses
- Many different rules for derivatives
- How to teach different between negative and subtraction
- Trig?!?!
- Best way to do all the string manipulation (which was actually to do no string manipulation)
- How to handle omission of multiplication signs

## About
I tried documenting this project thoroughly to allow others interested in CS to experience the same fascination in solving the issue of parsing expressions.
