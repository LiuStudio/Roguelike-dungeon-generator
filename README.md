# Roguelike-dungeon-generator
A Playground for Dungeon Generator! Have FUN!

## How to Run the App
This is a Single Page Application written in AngularJs, I have setup a simple Express Server to support the Display. 

After clone the Repo, please do the following

1. Under repo directory, Install all neccessary Packeges. : `npm install`
2. Start Server `npm start`
3. Open a Broweser, Type `http://localhost:3000` and Enter
4. Now Just click the Generate Button, everytime you should see a random Dungeon Map Generated.

There are some flaws to this script and I am sure there are improvements need to be done!  

## It's all about the thinking!
There are a lot of articles about Roguelike Dungeon Generator in all kinds of programing languages. Javascript is such a powerful one, and it would be great to have one Application written in pure Javascript, don't you think?

At the end of the day, it is all about the thinking, not about programing language, anyways. 

##The Algorithm

* I strongly recommend you read about Maze Generator Algorithm written by Jamis Bucks http://www.jamisbuck.org/presentations/rubyconf2011/
* My approach of generating this Maze comes from http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/


Here are the steps I follow when designing the Dungeon:  

1. Place Room in the map
	* Generate a Room in random location(x,y) and random W and L
	* Check whether this Room is overlapping with any other existing rooms
	* If no overlapping, place room in the map, continue
	* Otherwise, generate another Room and try to place room in map.
	* A maximum attempt is been set, so that the program won't stuck in infinent loop if it is impossible to put that many rooms in the map

2. Generate Maze around room
	* Pick a tile that is floor and surrounding are all floor, as "free Node";
	* start from this Node, look for possible directions the path can extend, randomly pick on from the possible directions
	* Push the current node in a stack, also push the node that can be path in to path array/queue ( whatever you want to call it)
	* repeat the above until from the current node, cannot find any possible directions to expand path
	* pop this node from stack, means go back to previous node and keep searching for possible directions, and start adding nodes into path from there
	* repeat the whole process, until the stack is empty, which means we have trace back to the beginning and make sure we expand our path as much as we can.
	* Push this path into paths array, pick another free node as starting node of a new path
	* keep doing the above, until there are no free node left in the map
	* Now we know we have flood the map with a Maze as much as we can.
3. Making the Connections
	* Now we have rooms and Mazes populated in the map, we need to connect them, with Entrance!
	* find a node/cell/tile that has path on one side and room on the other side, room has to be not connected
	* make it entrance and then mark the room as connected, and mare the path as connected
	* repeat until cannot find cell satisfy the condition above, now we have all the rooms connected. 
	* I haven't figure out how do I make sure all the paths are connected(working on it)
4. Remove Dead Ends
	* Now the map is a little bit too full that has a lot of dead ends, I need to find dead ends and remove them from the path

5. Add Map Entrance and Map Exit to the map.
	* Find a path node that on the border , make it Map Entrance/exit
	* If cannot find one, extend the node that most close to border towards border, until it reaches border, and make entrance and exit
	
## Some Study Notes Here as I am learning the concept of Roguelike Dungeon Generator
 A basic Dungeon Will need the following:
 
 * A Set of interconnected rooms, doors and tunnels
 * An entrance
 * An Exit
 * Every space must be reachable

 Reference: http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm
## Some Tips from Readings for making a GOOD Dungeon Generator
 
 * It needs to be fairly efficient--generator only runs when the player enters a new level
 * It needs to be connected--from any point in the dungeon, there is a way--posibly circuitous--to any other point
 * It is better that if dungeons to not be perfect--there are more than one ways from one point to the other
 * It would be better to have open rooms
 * It also need to have passageways

 Reference: http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/



