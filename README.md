[![Netlify Status](https://api.netlify.com/api/v1/badges/987b18a9-7288-4088-b864-a99f1ffbaca9/deploy-status)](https://app.netlify.com/sites/react-adventure-game-engine/deploys)


Thanks for checking out _React Adventure Game Engine_ (<acronym title="React Adventure Game Engine">R.A.G.E.</acronym>), a browser-based, throwback game engine built on React.

## A React.js game engine - and a tribute to 1980s adventure games
This game engine is heavily derived from 1980/90's graphic adventure computer games. Games with four (`CGA`) or sixteen (`EGA`) color graphics, driven with arrow keys for player movement and a text parser for executing game commands.


## Creating your first game
This is a [Create React App](https://github.com/facebookincubator/create-react-app) project, not ejected. The engine itself is in the `/src` folder and the games themselves live in `/public/games`.


1. Clone the repo, and start the `Create-React-App` project. (`npm start`)
2. Create a copy of `/public/games/gameTemplate` in the `/public/games` folder. This folder will contain code, styles, and assets specific to your game.
3. Update the references to it in `/public/games/gamelist.json`. 

```JSON
{
    "Title": "My awesome adventure game",
    "Path": "../games/awesomegame/gamedata.json",
    "CSS": "../games/awesomegame/gameassets/gameStyles.css",
    "JS":"../games/awesomegame/gameassets/gameLogic.js"
}
```


In your new game folder, you'll find folders and files ready to edit:

* `/public/games/<folder name>/gamedata.json` - A single JSON object containing metadata (title, description), room data, display objects, inventory, main menu items, and hero graphic specifications.
* `/public/games/<folder name>/gameassets/` - This folder will hold game-specific images, music files, code, and CSS.
* `/public/games/<folder name>/gameassets/gameLogic.js` - All non-engine logic code can live in here. You'll find two starter functions, one that fires when a room is loaded, and another that routes custom commands not found in the engine based on text input.

* `/public/games/<folder name>/gameassets/gameStyles.css` - This will be mostly empty. You'll want to use this file to reference all your graphic assets. On load, the game automatically parses every image in there and loads it into the browser cache for faster loading.

In the `/src` folder you'll find the game engine itself. It's set up such that no changes are required in this folder, but of course it's allowed because this is open source!

>In theory, your could run a game without anything a `gameLogic.js` - the engine will build out the rooms in gamedata.json. Your hero could walk around and look at things, get things, and enjoy the scenery.

## Building your game
`npm run build` or the build function of Create-React-App will build the game out to the `/public` folder.  At this point you can deploy (or upload) it to your web host of choice. 



## FAQ

### How does the engine work?
Most of the game's current status (player position on screen, inventory, flags) is maintained, during play, in app.js' state. Most components and custom code work to update this root-level state.  There are probably enough things tracked in state aross multiple components to justify using some state management system, but that was overhead I didn't want in this learning effort.
### But... why?
The primary reason was to give me a chance to learn React without making a CRUD form or TODO list. I hoped a game engine would afford me a much broader awareness of _why_ people used React.js over vanilla JavaScript.

### Why didn't you use?
There are a _ton_ of great React libraries and tools that would have made this effort significantly easier. But learning and understanding require doing the hard part first, before you can appreciate the value of a good state management library or animation library.

### Should I use it to make a game?
I mean, why not? If 1980s style advernture games are the style you want to mimic, and you're already comfortable with HTML5, CSS, JavaScript (especially reactive JavaScript frameworks like React and Vue), this might be the engine for you. It doesn't promise 60FPS, nor state of the art 3d graphics. 






# What's tracked in game state
In the root component (app.js), state drives the user interface and interactivity. Every component and custom function serves to update state, and React renders the game based on that.

#### General game state
State  | Type | Notes
------------ | ------------- | -------------
title | _string_ | Game title
subTitle | _string_ | Game sub title
description | _string_ | Game description, shown in 'About' menu link
version  | _number_ | Game version, shown in 'About' menu link
pausedgame | _boolean_ | Is the game paused or not
soundOn | _boolean_ | Sound on (true) or muted (false)
menuBarActive | _boolean_ | When false, the main menu is closed, when true it is open.
mainMenuItems | _array_ | An array objects to define the main menu. A reasonable default is provided by the engine.
inventory | _array_ | An array of objects, the player's game inventory and whether they have it on them or not
inventoryVisable | _boolean_ | If false, the inventory interface is closed. If true, it is shown
highScore | _number_ | Maximum possible score in the game. Shown in the UI
currentScore | _number_ | Player's current score.
gameLogic | _string_ | Path to custom JS file for the game.
playfieldX | _number_ | Width of the game play area.
playfieldY | _number_ | Height of the game play area.
textParserValue | _string_ | whatever is currently on screen in the text parser
submittedText | _string_ | Value of the text that is submitted when player hits 'enter'
helpText | _string_ | Help text for the game, shown when player types 'help' or selects help from menu
flags | _object_ | Free-form keyvalue store to mark progress in the game. 

#### Hero state
State | Type | Notes
------------ | ------------- | -------------
heroHeight | _number_ | Hero height in pixels
heroWidth  | _number_ | Hero width in pixels
heroSprite | _string_  | Base64 enocded version of hero graphic sprite. Like `"url('data:image/png;base64,iVBORwc..."` except way longer.
heroAlive | _boolean_ | Alive (true) or dead (false)
heroDirection | _string_ | Current direction, one of four values `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`
heroLastDirection: | _string_ | The previous direction the hero character is facing
heroMoving | _string_ | One of two values, either `moving` or `stopped` 
heroPositionX | _number_ | Current position of player, relative to top edge of the play area
heroPositionY: | _number_ | Current position of player, relative to left edge of the play area
heroPositionCollided | _boolean_ | Has the player collided with an object?
heroMovementDisance | _number_ | Configurable number to control how far hero moves each render
heroMovementUpdateSpeed: | _number_ | Configurable number to control speed hero moves each render
heroMovementSpeeds | _array_ | Array of numbers used by speed setting in main menu

#### Modal dialog box state
State  | Type | Notes
------------ | ------------- | -------------
modalStatus | _boolean_ | When true, the modal is open. When false it is closed
modalClickToClose | _boolean_ | When true, the modal is open. When false it is closed
modalWidth | _number_ | Width of the modal. Height cannot be set. 
modalTop | _number_ | Distance of the modal from the top of the screen.
modalWidthDefault | _number_ | When the modal is reset, this number is re-applied to _modalWidth_
modalTopDefault | _number_ | When the modal is reset, this number is re-applied to _modalTop_
modalText | _string_ | Modal text. Most of the time, you'll just use this one. The other three slots are optional.
modalTextSlot2 | _string_ | 2nd line of modal text (if passed)
modalTextSlot3 | _string_ | 3rd line of modal text (if passed)
modalTextSlot4 | _string_ | 4th line of modal text (if passed)
modalTextScript | _array_ | An array of objects, passing mulitple lines of dialog to be shown in sequence.
modalConfirmation | _string_ | A string of text that is used to optionally execute code after the user hits enter in a modal box. 

#### Room-related state
State  | Type | Notes
------------ | ------------- | -------------
rooms | _array_ | Array of objects. All the rooms in the game. Probably the biggest object in the game.
roomExits | _array_ | Array of objects. Defines where on the screen the hero exits the room and moved to the next room by the game engine
roomCurrent | _string_ | Name of the current room, per its name in gamedata.json
roomPrevious | _string_ | The prior room the user was in
roomCurrentObjects | _array_ | Array of objects, all the scenery and trees and images in a room. Not for inventory items
roomVisibleInventory | _array_ | Array of objects of inventory items that are visible on screen
roomNearbyInventoryItems | _array_ | Array of strings. Inventory items that are close enough for the player to get.




#### Built in keyboard controls
In the spirit of the 1980s, this engine is strictly keyboard driven. No mouse support is provided. The engine's functions are coded to suport:
  * *Tab* key opens the inventory (and any other key closes it)
  * *Escape* key
    * Opens the main menu
    * Closes the main menu (if it is open)
    * Dismisses any open modal dialog box
  * *Enter* key: 
    * Dismisses an open modal dialog box
    * Submits text parser words 
    * Selects a main menu item
    * Confirms a choice modal dialog box action (like saving or loading a saved game)
  * *Arrow* keys (not `WASD`):
    * Move the hero character around the screen
    * Controls the main menu when open
    * Diagonals on the num pad aren't supported currently

#### Text command input
As the player adventures around, they must ineract with their environment. Since no mouse support is provided, the player must type commands like `open door` or `get the taco` or `give taco to horse` to make progress in the same.

There is built in support for these commands:
* *Get* - As in `"get taco"` or `"get the keycard"`. There's support for getting any item in the gamedata.json Inventory array, as long as the room matches. Error messaging is available for when items aren't in the right room.
* *Help* - Opens a modal dialog box with the help text from gamedata.json.
* *Inventory* - Opens the inventory screen.
* *Look* - As in `"look"` or `"look at the monster"`.  There's support for just typing it alone, as well as support for looking at any display object in gamedata.json. 
* *Talk* - As in `"talk to blacksmith"`. As long as the NPC is labled as such in the gamedata.json file, a reponse with automatically be returned.  There's error handling for players to try to talk to inanimate objects.

There's support for custom commands as well. The engine will check 


## What's in an individual game
Each game can be self contained in its own folder in `/public/games`.  This repo houses a test game in a folder called `/testgame1`.

In the root should be a file called gamedata.json, which houses the default state of the game, all rooms and room objects, hero details, menu choices, etc.  There should also be a subfolder called `/gameassets`.  In `/gameassets`, there should be all your graphical files, as well as the game's stylesheet (`gameStyles.css`) and custom code file (`gameLogic.js`).





















### An example Inventory item in gamedata.json

```javascript
{
    "Name": "Taco", // Name displayed in the inventory screen
    "owned": false, // Does player have it
    "available":true, // Is it available to get, or exhausted
    "Description": "You see a delicous taco and want nothing more than to eat it.",  // shown when player types 'look taco'
    "FoundRoom":3,
    "Visible":true,
    "x":290,
    "y":480,
    "zIndex":5,
    "width":60,
    "height":40
},


```



### An example custom function from gamelogic.js

```javasscript
return {
  // How long to wait before starting, in ms
  "delay": 0, 
  "scoreChange": 1,
  "flagSet": {
      "tacoEaten": true,
  },
  
  // Remove item from inventory
  "removeItems":["Taco","Wallet"],

  // Halt
  "halt": true,

  // Array of state changes
  "newState": [{
      modalClickToClose: true,
      modalText: "You decide to eat the taco",
      modalTextSlot2: "It was DELICOUS!",
      modalStatus: true,
      pausedgame: true,
  }],

  "custFunc": function () {
      console.log("CUSTOM")
  }
}
```











