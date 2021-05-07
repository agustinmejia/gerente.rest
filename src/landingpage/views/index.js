import { React } from "react";

// Components
import Navigation from '../components/navigation';
import Header from '../components/header';
import Features from '../components/features';
import About from '../components/about';
import Services from '../components/services';
import Gallery from '../components/gallery';
import Testimonials from '../components/testimonials';
import Footer from '../components/footer';

const Index = props => {
    return(
        <>
            <Navigation />
            <Header data={props.data.Header} />
            <Features data={props.data.Features} />
            <Services data={props.data.Services} />
            <Gallery data={props.data.Gallery} />
            <Testimonials data={props.data.Testimonials} />
            <About data={props.data.About} />
            {/* <Contact data={props.data.Contact} /> */}
            <Footer />
        </>
    );
}

export default Index;