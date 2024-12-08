import React from "react";
import "../../styles/aboutUs/AboutUs.css"; // Optional: Include styles if needed

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <p>Welcome to our Movie App Project!</p>
      <section>
        <h2>Who We Are</h2>
        <p>
          We are a passionate group of developers from the <strong>Oulu University of Applied Sciences</strong>, 
          working together on an advanced web applications project. Our mission is to create a dynamic platform 
          for movie enthusiasts that provides seamless access to movie information and theater showtimes.
        </p>
      </section>
      <section>
        <h2>What We Do</h2>
        <p>
          Our movie app leverages open-source data from <strong>Finnkino</strong> (The Movie Database)  
          to bring users detailed movie insights and schedules for theaters. Built with a powerful tech stack—<strong>React</strong> for 
          the frontend, <strong>Node.js</strong> and <strong>Express</strong> for the backend, and <strong>PostgreSQL</strong> 
          for data storage—we ensure a smooth and efficient user experience.
        </p>
      </section>
      <section>
        <h2>Features We Offer</h2>
        <ul>
          <li><strong>Responsive Design:</strong> Enjoy our app across all devices, big or small.</li>
          <li><strong>Personalized Accounts:</strong> Sign up to access exclusive features like group pages, favorite lists, and more.</li>
          <li><strong>Search & Discover:</strong> Filter and explore movies using various criteria.</li>
          <li><strong>Showtimes at Your Fingertips:</strong> Browse schedules for movie theaters effortlessly.</li>
          <li><strong>Community Building:</strong> Create or join groups to discuss and share movie experiences.</li>
        </ul>
      </section>
      <section>
        <h2>Our Vision</h2>
        <p>
          We aim to connect movie lovers through an engaging and user-friendly platform, enhancing the way people explore, 
          review, and share their passion for films.
        </p>
      </section>
      <p>Thank you for joining us on this cinematic journey!</p>
    </div>
  );
};

export default AboutUs;
