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
  constructor(props){
    super(props)
  }
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
                  {
                    this.props.data.map(item => 
                      <div className="col-md-4" style={{padding: 20}}>
                        <a href={ item.image }>
                          <img src={ item.thumbnail } width="100%" alt={ item.caption } />
                        </a>
                      </div>
                    )
                  }
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
