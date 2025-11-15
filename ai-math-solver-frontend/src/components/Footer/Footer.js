import './Footer.css';

function Footer({ logo }) {
  return (
    <footer>
      <img
        className="footer-company-logo"
        src={logo}
        alt="company logo"
      />

      <div className="company-info">
        <p className="Company"></p>
        <p>About Infinity AI</p>
        <p>Help</p>
        <p>Contact Us</p>
        <p>© Menzi Shazi. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;