# Project-Knights-Travails-The-Odin-Project

Knights Travails project for The Odin Project: a `knightMoves` function that finds
the shortest way for a knight to travel between two squares of a standard 8x8
chessboard.

## Modules

The source files use ES module syntax (`import` / `export default`).

## Scripts

`npm test`

`npm run test:watch`

`npm run lint`

`npm run lint:fix`

`npm run format`

`npm run format:check`

`npm run demo`

## The problem

The chessboard is treated as a graph: every square is a vertex, written as a pair
of coordinates `[x, y]` where both numbers are between 0 and 7, and every legal
knight move is an edge between two vertices. The graph is never built explicitly.
Instead the search starts on the starting square and explores the moves as it
goes.

A knight jumps two squares in one direction and one square in the other, so from
`[0, 0]` it can reach `[1, 2]` and `[2, 1]`. Moves that would leave the board are
never allowed.

## API

`knightMoves(start, end)`

Both arguments are squares. The function runs a breadth-first search, so the
first time it reaches the ending square it is already on one of the shortest
paths, prints the trip and returns the squares the knight stops on, starting
square first.

Breadth-first search is the right fit here because every move costs the same: it
finds the shortest path instead of merely a valid one, and the visited squares
keep it out of the endless cycles a depth-first search would have to guard
against by hand.

```js
knightMoves([0, 0], [1, 2]);
knightMoves([3, 3], [4, 3]); 
```

What the demo prints for the lesson's three move call (the lesson lists a
different but equally short route, see below):

```
> knightMoves([3,3],[4,3])
You made it in 3 moves! Here's your path:
[3,3]
[4,5]
[6,4]
[4,3]
```

`[0, 0]` to `[3, 3]` may come back as either `[[0,0],[2,1],[3,3]]` or
`[[0,0],[1,2],[3,3]]`. Every square on the board can be reached from every other
square within six moves.

`formatKnightMoves(path)` is a named export that turns a path into the printed
text, which keeps the message testable without a console:

```js
formatKnightMoves([[4, 4]]);

```

A square that is not a pair of coordinates, holds something other than whole
numbers, or falls outside the board throws a `TypeError` before anything is
printed.

`knightMoves` returns the path as an array of squares and also `console.log`s it,
so the demo reads like the lesson transcript while the returned value stays easy
to assert in the tests.
