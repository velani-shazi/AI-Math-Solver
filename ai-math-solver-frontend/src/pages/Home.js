/**
 * Home Page
 * 
 * Landing page of the application showing:
 * - Hero section with main value proposition
 * - Features/cards section highlighting key capabilities
 * - Calculator explanation/walkthrough
 * 
 * This is the entry point users see when visiting the app
 */

import Hero from "../components/Hero/Hero";
import CardContents from '../components/CardContents/CardContents';
import CalculatorExplanation from "../components/CalculatorExplanation/CalculatorExplanation";

/**
 * Home Component
 * Renders the complete landing page layout
 */
function Home() {
    return (
        <div className="Home">
            {/* Hero section with main headline and CTA */}
            <Hero />
            
            {/* Feature cards section */}
            <CardContents />
            
            {/* Step-by-step calculator explanation */}
            <CalculatorExplanation />
        </div>
    )
}

export default Home;