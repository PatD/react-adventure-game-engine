import React, { Component } from 'react';

export class PreloadGameAssets extends Component {
    constructor() {
        super();
        this.state = {
            gameAssetURLs: []
        };
    }

    // Extracts any images from CSS file and loads them into the browser for faster load times in game
    preloadGameAssets = () => {

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

        this.setState({ gameAssetURLs: cssExtracts })
    }


    componentDidUpdate(prevProps) {
        // Checks if a new game is loaded
        if (this.props.gameLogic !== prevProps.gameLogic) {
            this.preloadGameAssets();
        }
    }

    render() {
        return (
            <div className="preloadimage">
                {this.state.gameAssetURLs.map(asset => <img key={asset} src={asset} alt="" />)}
            </div>
        );
    }
}

export default React.memo(PreloadGameAssets);