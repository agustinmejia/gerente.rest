import React, { Component } from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";

const options = {
  settings: {
    overlayColor: "rgb(33, 47, 60, 0.9)",
  },
  buttons: {
    backgroundColor: "#28B463",
    iconColor: "white",
  },
  caption: {
    captionColor: "#28B463",
    captionTextTransform: "uppercase",
    captionFontSize: 40
  }
};

export class Gallery extends Component {
  render() {
    return (
      <div id="portfolio" className="text-center">
        <div className="container">
          <div className="section-title">
            <h2>Galeria</h2>
            <p>A continuación te mostramos capturas de nuestra pataforma de administración.</p>
          </div>

          <div className="row">
            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <a href="img/portfolio/01-large.jpg">
                  <img src="img/portfolio/01-small.jpg" alt="Umbrella" />
                </a>
                <a href="img/portfolio/02-large.jpg">
                  <img src="img/portfolio/02-small.jpg" alt="Blue sky" />
                </a>
                <a href="img/portfolio/03-large.jpg">
                  <img src="img/portfolio/03-small.jpg" alt="Blue sky" />
                </a>
                <a href="img/portfolio/04-large.jpg">
                  <img src="img/portfolio/04-small.jpg" alt="Blue sky" />
                </a>
                <a href="img/portfolio/05-large.jpg">
                  <img src="img/portfolio/05-small.jpg" alt="Blue sky" />
                </a>
                <a href="img/portfolio/06-large.jpg">
                  <img src="img/portfolio/06-small.jpg" alt="Blue sky" />
                </a>
              </SRLWrapper>
            </SimpleReactLightbox>
          </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
