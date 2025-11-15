import Hero from "../components/Hero/Hero";
import CardContents from '../components/CardContents/CardContents';
import CalculatorExplanation from "../components/CalculatorExplanation/CalculatorExplanation";

function Home() {
    return (
        <div className="Home">
            <Hero />
            <CardContents />
            <CalculatorExplanation />
        </div>
    )
}

export default Home;