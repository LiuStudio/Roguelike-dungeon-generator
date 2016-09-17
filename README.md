# Roguelike-dungeon-generator
A Playground for Dungeon Generator! Have FUN!

##How to Run the App
This is a Single Page Application written in AngularJs, I have setup a simple Express Server to support the Display. 

After clone the Repo, please do the following

1. Under repo directory, Install all neccessary Packeges. : `npm install`
2. Start Server `npm start`
3. Open a Broweser, Type `http://localhost:3000` and Enter
4. Now Just click the Generate Button, everytime you should see a random Dungeon Map Generated.

##Some Study Notes Here as I am learning the concept of Roguelike Dungeon Generator
 A basic Dungeon Will need the following:
 
 * A Set of itnerconnected rooms, doors and tunnels
 * An entrance
 * An Exit
 * Every space must be reachable

 Reference: http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm

 ##Some Tips from Readings for making a GOOD Dungeon Generator
 
 * It needs to be fairly efficient--generator only runs when the player enters a new level
 * It needs to be connected--from any point in the dungeon, there is a way--posibly circuitous--to any other point
 * It is better that if dungeons to not be perfect--there are more than one ways from one point to the other
 * It would be better to have open rooms
 * It also need to have passageways

 Reference: http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/



