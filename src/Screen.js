import React from "react";
import TextInputParse from './TextInputParser'
import Hero from './Hero'
import DisplayObjects from './DisplayObjects'
import RoomExits from './RoomExits'

// Component that handles rendering things in the gameplay area. Characer, parser, objecss. 
const Screen = (props) => {

  // Since the hero sprite is base64, add it as a style stag:
  const heroSpriteCSS = `#hero {background-Image:` + props.heroSprite + `}`

  return (
    <React.Fragment>

      <script script={props.gameLogic}></script>

      <style>
        {heroSpriteCSS}
      </style>
      <section id="gameUI" style={{ width: props.gameWidth, height: props.gameHeight }}>
        <main className={props.roomCurrentName + " " + props.roomCurrentAltStyle} >

          <RoomExits
            roomExits={props.roomExits}
            roomCurrentName={props.roomCurrentName} />

          <DisplayObjects
            roomCurrent={props.roomCurrent}
            inventory={props.inventory}
            roomCurrentName={props.roomCurrentName}
            roomCurrentObjects={props.roomCurrentObjects} />

          {props.heroAlive ?
            <React.Fragment>
              <Hero
                heroHeight={props.heroHeight}
                heroWidth={props.heroWidth}
                heroPositionX={props.heroPositionX}
                heroPositionY={props.heroPositionY}
                heroDirection={props.heroDirection}
                heroMoving={props.heroMoving}
                heroSprite={props.heroSprite}
              />
            </React.Fragment>
            : null}

        </main>

        <TextInputParse
          addToInventory={props.addToInventory}
          flags={props.flags}
          handleFlagChange={props.handleFlagChange}
          handleCustomReturnedCode={props.handleCustomReturnedCode}
          handleSubmittedTextModal={props.handleSubmittedTextModal}
          haltHero={props.haltHero}
          heroHeight={props.heroHeight}
          heroWidth={props.heroWidth}
          heroPositionX={props.heroPositionX}
          heroPositionY={props.heroPositionY}
          heroDirection={props.heroDirection}
          heroMoving={props.heroMoving}
          heroSprite={props.heroSprite}
          hideModal={props.hideModal}
          inventory={props.inventory}
          keyPress={props.keyPress}
          removeFromInventory={props.removeFromInventory}
          roomCurrent={props.roomCurrent}
          roomCurrentDescription={props.roomCurrentDescription}
          roomCurrentObjects={props.roomCurrentObjects}
          roomNearbyInventoryItems={props.roomNearbyInventoryItems}
          textParserChange={props.textParserChange}
          textParserValue={props.textParserValue}
          textPopulateStateAndClearParser={props.textPopulateStateAndClearParser}
          toggleInventoryScreen={props.toggleInventoryScreen}
          updateScore={props.updateScore}
          updateAppComponentState={props.updateAppComponentState}
        />

      </section>
    </React.Fragment>)

};

export default React.memo(Screen);
