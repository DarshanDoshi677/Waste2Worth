
import "./about.css"
import image1 from "../assets/6895997.jpg"
//import bgmg from "../assets/bg-2.jpg"
import darshan from "../assets/darshan.jpg";
import mitesh from "../assets/miteshbg.jpg"

const About = () => {
  return (
    <div id='about-body'>
      <header>
        <h1>About Us</h1>
        <p>Fighting Hunger, Nourishing Communities</p>
    </header>

    <section className="about-container">
        <div className="about-content">
            <h2>Who We Are</h2>
            <p>At <strong>Hope Food Bank</strong>, we are dedicated to eliminating hunger and ensuring food security for all. Our mission is to provide nutritious food to families and individuals in need through community partnerships, donations, and volunteers.</p>
        </div>

        <div className="about-image">
            <img src={image1} alt="Food donation at food bank"/>
        </div>
    </section>

    
    <section className='founder-container'>
    <div className="testimonials">
        <h1>Founders</h1>
        {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi non optio velit, nemo animi temporibus dicta facere accusantium illo voluptatum est veniam facilis maxime doloribus rerum dolore reiciendis eos neque.</p> */}
        
        <div className="row">
            <div className="testimonial-col">
                <img src={darshan} alt="" />
                 <div>
                    <h4><b>Role: </b>CEO</h4>
                    <p>I’m Darshan Doshi, founder of Waste2Worth. Fueled by curiosity and the desire to make a difference, I wanted to create something that not only showcases our technical abilities but also contributes to society.
The idea for Waste2Worth emerged through countless conversations, research, and a drive to tackle food wastage with smart technology. 

</p>
                    <h3>Darshan Doshi</h3>
                </div>
            </div>

            <div className="testimonial-col">
                <img src={mitesh} alt="" />
                 <div>
                    <h4><b>Role: </b>CEO</h4>
                    <p>I’m Mitesh Dhabekar, the founder of Waste2Worth. As a tech enthusiast and a socially driven mind, 
                        I’ve always been passionate about using software to solve real-life problems. The idea of Waste2Worth came from witnessing food wastage around
                         us and realizing the power of digital solutions in creating meaningful change.</p>
                    <h3>Mitesh Dhabekar</h3>
                </div>
            </div>
        </div>
    </div>
    </section>



    <section className="mission">
        <h2>Our Mission</h2>
        <p>To create a hunger-free community by distributing food, supporting sustainability, and advocating for policy change.</p>
    </section>

    <section className="values">
        <h2>Our Core Values</h2>
        <div className="values-list">
            <div className="value">
                <h3>Compassion</h3>
                <p>We serve with kindness and respect.</p>
            </div>
            <div className="value">
                <h3>Integrity</h3>
                <p>Transparency in everything we do.</p>
            </div>
            <div className="value">
                <h3>Community</h3>
                <p>Building strong partnerships to fight hunger.</p>
            </div>
        </div>
    </section>

    </div>
  )
}

export default About