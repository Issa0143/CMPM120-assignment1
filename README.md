# The Silent Reserve - CMPM 120 Project 1 Fall 2026 - Josue Aguilar Mejia

Based on the grid-world framework by Markus Eger, with gameplay additions by Josue Aguilar Mejia.

## Lock-and-Key Puzzles
Rooms read their required items from the world JSON. Entering a locked room consumes the required items, and the room remains unlocked for later visits.

## Item Interactions
Players can choose to read a newspaper for advice, offer pie to a cat, or feed a banana to a giraffe. The newspaper requires one item, while the feeding interactions each require both corresponding items in the player's inventory.

## Scoring 
Players earn 10 points per distinct item type collected and 50 points for reaching the exit, minus one point per room visit, with a minimum score of zero. Items used to unlock rooms still count toward collection points.

## Map Compatibility
The game supports local maps and the assignment's random map generator, accepting either `end` or `exit` for the destination coordinates. Testing included completing seed 1, checking locked-room entry and revisits, and exploring two randomly generated maps.

## Running the Game
Open the project folder in VS Code and run index.html using Live Server. The default world is myWorld.json; to test generated maps, change the URL in Engine.load at the bottom of rules.js.

## Bonus Features
No bonus features are claimed.