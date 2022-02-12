import React, { useState, useEffect } from "react";

const PreloadGameAssets = (props) => {

    const [gameAssetURLs, setURLs] = useState([]);

    // Extracts any images from CSS file and loads them into the 
    // browser for faster load times in game. 
    const preloadGameAssets = () => {

        let cssExtracts = [...document.styleSheets]
            .filter(sheet => {
                try { return sheet.cssRules }
                catch { }
            })
            .flatMap(sheet => Array.from(sheet.cssRules))
            .filter(rule => rule.style)
            .filter(rule => rule.style.backgroundImage !== undefined) // Added this for Firefox
            .filter(rule => rule.style.backgroundImage !== '')
            .filter(rule => rule.style.backgroundImage !== 'initial')
            .filter(rule => rule.style.backgroundImage.includes("url"))
            .reduce((urls, { style }) => {
                if (style.backgroundImage.startsWith('url("data') === false) {
                    let img = style.backgroundImage.replace('url("', '')
                    img = img.replace('")', '')
                    urls.push(img);
                }
                return urls;
            }, []);

        setURLs(cssExtracts)
    }

    // When gamelogic.js is loaded, run the funciton that extracts URLs of images.
    useEffect(() => {
        preloadGameAssets()
    }, [props.gameLogic]);

    return (
        <div className="preloadimage">
            {gameAssetURLs.map(asset => (
                <img key={asset} src={asset} />))
            }
        </div>
    );
};

export default React.memo(PreloadGameAssets);
