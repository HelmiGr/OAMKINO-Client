import React from "react";
import "../../styles/footer/Footer.css";
// import { Link } from "react-router-dom";
// the links need to be changed to take the user to the correct page, will do this in a later push

export default function () {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="footer-col">
            <h4>Theatre Showtimes</h4>
            <ul>
              <li>
                <a href="/showtime_footer/1021">Finnkino Tampere</a>
              </li>
              <li>
                <a href="/showtime_footer/1002">Finnkino Helsinki</a>
              </li>
              <li>
                <a href="/showtime_footer/1018">Finnkino Oulu</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Movie Genres</h4>
            <ul>
              <li>
                <a href="/search?genre=Kauhu">Horror</a>
              </li>
              <li>
                <a href="/search?genre=Toiminta">Action</a>
              </li>
              <li>
                <a href="/search?genre=Komedia">Comedy</a>
              </li>
              <li>
                <a href="/search?genre=Romantiikka">Romance</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <ul>
              <li>
                <a href="/aboutus">About Us</a>
              </li>
              <li>
                <a href="/groups">Groups</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.twitter.com/">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
