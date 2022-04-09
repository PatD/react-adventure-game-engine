import React, { useEffect } from 'react';

const playSound = (props) => {

  const clip = new Audio(props.gameAssetPath + props.soundClip)

  const playSoundClip = () => {
    if (props.soundOn === true) {
      return clip.play()
    }
  }

  useEffect(() => {
    if (props.soundClip !== "") {
      return playSoundClip()
    }
  }, [props.soundClip]);

  return null
};

export default React.memo(playSound);