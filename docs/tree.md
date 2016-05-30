# Tree
The Tree class is fundamental to the project. It's methods allow for easy manipulation.

## getDir()
### Description
This method is used to convert dir into 'left' or 'right'. It allows for other functions to pass in positive numbers or negative numbers to indicate right or left.
### Params
| Name  | Description | Ex |
|-------|-------------|----|
| dir |  A number or string that indicates left or right | `-1`, `'left'`, `1`, `'right'` |

## add()
### Description
This method is used to convert dir into 'left' or 'right'. It allows for other functions to pass in positive numbers or negative numbers to indicate right or left.
### Params
| Name  | Description | Ex |
|-------|-------------|----|
| dir |  A number or string that indicates left or right | `-1`, `'left'`, `1`, `'right'` |
| val | The value that should be added | `'+'`, `'-'`, `4`, `'sin'` |

## r()
### Description
Shortcut for add('right', val)
### Params
| Name  | Description | Ex |
|-------|-------------|----|
| v | The value that should be added | `'+'`, `'-'`, `4`, `'sin'` |

## equals()
### Description
Recursively checks if two trees are equal. Uses TreePattern.eq to check equality, so this method is compatible with TreePattern trees.
### Params
| Name  | Description | Ex |
|-------|-------------|----|
| tree | Another Tree object | `{val: '+', left: '2', right:'4'}` |

## clone()
### Description
Returns a copy of the tree.

## switch()
### Description
Switches the left and right branch.

## contains()
### Description
Recursively checks if a target value is within a tree. Uses TreePattern.eq to check, so it is compatible with TreePattern rules.
### Params
| Name  | Description | Ex |
|-------|-------------|----|
| target | A value to be searched for | `sin`, `TreePattern.NUM` |

## replace()
### Description
Recursively replaces a target value with a replace value everywhere in the tree.
### Params
| Name  | Description | Ex |
|-------|-------------|----|
| target | A value to be searched for | `TreePattern.MARKER`, `TreePattern.NUM`, `x` |
| replace | Replace value | `cos`, `1`, `{val: '+', left: '2', right:'4'}`|

## toString()
### Description
Overrides default toString method, which allows for easy debugging to view a tree.

## toFlatString()
### Description
A more compact version of toString() that displays everything on a single line.
