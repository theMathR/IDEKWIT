# IDEKWIT cartridge documentation
IDEKWIT cartridges are written in ~~IDEKWITScript~~ a subset of JavaScript. Their code is executed every third of a second by the console.

## Limitations
- No strings
- The only keywords are: `var`, `if`, `else`, `switch`, `case`, `break`, `null`, `true`, `false`, and `undefined`
- No loops (the entire code is in a loop)
- The only methods and properties are `array.includes()` and `array.length`
- Variable names can be only one character long

## Memory
Variables are not stored between the executions of the code. To store data, use the variable `memory`.  
`memory`'s default value is `null`.

## Input
Input from the touchpad is stored in the variable `input`.
|`input` value|Meaning|
|-|-|
|0|No input|
|1|Press|
|2|Swipe right|
|3|Swipe up-right|
|4|Swipe up|
|5|Swipe up-left|
|6|Swipe left|
|7|Swipe down-left|
|8|Swipe down|
|9|Swipe down-right|

## Output
To use the JavaScript console, use the `log` function.

The screen uses black rectangles to display things.
|Function|Effect|
|-|-|
|`new_rectangle(id, x, y, width, height)`|Creates a new rectangle|
|`remove_rectangle(id)`|Removes a rectangle|
|`set_speed(id, x, y)`|Sets a rectangle's speed|
|`clear_screen()`|Clears the screen|

Coordinates and sizes are in pixels (speeds are in pixel/second). The IDEKWIT's screen is 134x101.

### Collisions
The `get_collisions(id)` function will give a list of all the ids of the rectangles colliding with the one chosen.  
The first element of this list is a list of collisions with the screen's borders (`[left, up, right, down]`).
