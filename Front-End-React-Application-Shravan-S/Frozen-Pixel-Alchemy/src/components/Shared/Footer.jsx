import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSnapchat, faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from 'react-router-dom';
import '../../stylesheets/FooterStylingSheet.css';

const Footer = () => {
    return (
        <div className="footer-basic">
            <footer>
            {/* Social Media Icons */}
                <div className="social">
                    <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#" aria-label="Snapchat"><FontAwesomeIcon icon={faSnapchat} /></a>
                    <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a>
                </div>

                {/* Footer Navigation */}
                <ul className="list-inline">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/photographer">Services</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/contact">Contact Me</NavLink></li>
                    <li><NavLink to="/terms">Terms</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                </ul>

                {/* Dynamic Copyright Year */}
                <p className="copyright">Frozen Pixel Alchemy © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default Footer;
