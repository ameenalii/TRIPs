import React from 'react';
import './index.css';
import Fetch from "../Fetch/Fetch"

const Landing = () => (
  <div>
    <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
       
        <nav id="main-nav">
            <div className="logo">
               <span>Croczi</span>
            </div>
            <details>
                <summary>
                    <div className="closed">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <div className="open">
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </summary>
                <ul>
                    <li><a className="active" href="#"> Croczi Trip </a></li>
                    <li><a href="#">Log In</a></li>
                    <li><a href="#">Sign up</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact us</a></li>
                </ul>
            </details>

        </nav>
        <section id="jellyfish"  className="active">

            <Fetch />            
        
            <div className="box" id="jellyfish-home" >
                <h2>Croczi Trip</h2>
                <h3> Your best place to get your Tickets, Take the chance Now </h3>
            </div>
            <div id="bg">
              <img src={require('../../assets/3.jpg')}  alt=""  />
            </div>

        </section> 
  </div>
);

export default Landing;