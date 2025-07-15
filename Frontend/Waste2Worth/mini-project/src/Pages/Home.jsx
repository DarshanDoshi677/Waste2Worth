import "../Global.css";
import { Link } from "react-router-dom";

import bgimg from "../assets/aabg.png"
import img2 from "../assets/mealhome.png"
import logo from "../assets/Logo1.png"
import icon1 from "../assets/icon-1.webp"
import icon2 from "../assets/icon-2.webp"
import icon3 from "../assets/icon-3.webp"
import icon4 from "../assets/icon-4.webp"





const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <div className="bg-container">
          <img src={bgimg} alt="background" id="bg-img"/>
        </div>
        <div className="hero-heading">
          <h1>Ending The Line of Hunger</h1>
          <p>We empower our beneficiaries to break the cycle of poverty and malnutrition</p>
          <Link to="/donateform">
            <button>DONATE NOW!</button>
          </Link>
        </div>
      </div>

      <div id="bottom-container">
          <div className="card-container">
            <div className="card">
              <img src={icon1} alt="" />
              <h2>27.3</h2>
              <p>India ranks 105 out of 127 countries, indicating a ‘serious’ level of hunger severity, with a recorded GHI score of 27.3 in 2024.</p>
            </div>

            <div className="card">
              <img src={icon2} alt="" />
              <h2>11,11,357</h2>
              <p>Children in India suffered from Severe Acute Malnutrition in 2023 and of these, 56,143 children are under five years of age.</p>
            </div>

            <div className="card">
              <img src={icon3} alt="" />
              <h2>35.5%</h2>
              <p>Prevalence of child stunting in India stands at 35.5%, indicating chronic undernutrition</p>
                <div className="p-child">
                <focus> Child stunting: </focus>The share of children under the age of five who have low height for their age, reflecting chronic undernutrition
                </div>
            </div>

            <div className="card">
              <img src={icon4} alt="" />
              <h2>18.7%</h2>
              <p>India’s child wasting rate is 18.7%, the highest among all countries in the report, reflecting acute undernutrition </p>
              <div className="p-child">
              <focus>Child Wasting:</focus>The share of children under the age of five who have low weight for their height, reflecting acute undernutrition
              </div>
            </div>
            
          </div>
      </div>

      <div className="home-info">
        <h2>How We Help</h2>
        <img src={img2} alt="" />
        <p>Whether a meal or a bag of groceries, you can count on the Food Bank to supply nutritious food with dignity.</p>
      </div>




  



      <section id="foot">
        <div className="footer-container">
            
            {/* <!-- Left Section - Logo & Address --> */}
            <div className="footer-left">
                <a href="/" className="footer-logo">
                <pre>Waste
                      2
                    Worth
                </pre></a>
                <p className="footer-address">
                    123 Ravet Road, Pune, India <br/>
                    Email: admin@brand.com <br/>
                    Phone: +91-123 456 7890
                </p>
            </div>

            {/* <!-- Center Section - About & Take Action --> */}
          

            {/* <!-- Right Section - Social Media & Newsletter --> */}
            <div className="footer-right">
                <div className="footer-social">
                    <a href="https://www.google.com" target="blank"><i className="fab fa-facebook" /></a>
                    <a href="https://x.com/?lang=en&mx=2" target="blank"><i className="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/" target="blank"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.google.com/" target="blank"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>
      </section>


    </div>
  );
};


export default Home;
