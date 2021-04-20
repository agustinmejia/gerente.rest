import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { env } from '../../env';

const { color } = env;

const options = {
  settings: {
    overlayColor: "rgb(33, 47, 60, 0.9)",
  },
  buttons: {
    backgroundColor: color.primary,
    iconColor: "white",
  },
  caption: {
    captionColor: color.primary,
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
            <div className="col-md-12">
              <SimpleReactLightbox>
                <SRLWrapper options={options}>
                  <div className="col-md-4" style={{padding: 0}}>
                    <a href="img/portfolio/01-large.jpg">
                      <img src="img/portfolio/01-small.jpg" width="100%" alt="Umbrella" />
                    </a>
                  </div>
                  <div className="col-md-4" style={{padding: 0}}>
                    <a href="img/portfolio/02-large.jpg">
                      <img src="img/portfolio/02-small.jpg" width="100%" alt="Blue sky" />
                    </a>
                  </div>
                  <div className="col-md-4" style={{padding: 0}}>
                    <a href="img/portfolio/03-large.jpg">
                      <img src="img/portfolio/03-small.jpg" width="100%" alt="Blue sky" />
                    </a>
                  </div>
                  <div className="col-md-4" style={{padding: 0}}>
                    <a href="img/portfolio/04-large.jpg">
                      <img src="img/portfolio/04-small.jpg" width="100%" alt="Blue sky" />
                    </a>
                  </div>
                  <div className="col-md-4" style={{padding: 0}}>
                    <a href="img/portfolio/05-large.jpg">
                      <img src="img/portfolio/05-small.jpg" width="100%" alt="Blue sky" />
                    </a>
                  </div>
                  <div className="col-md-4" style={{padding: 0}}>
                    <a href="img/portfolio/06-large.jpg">
                      <img src="img/portfolio/06-small.jpg" width="100%" alt="Blue sky" />
                    </a>
                  </div>
                </SRLWrapper>
              </SimpleReactLightbox>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
