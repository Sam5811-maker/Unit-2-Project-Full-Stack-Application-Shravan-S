import { useNavigate } from "react-router-dom";
import Button from "../Shared/Button";
import "../../stylesheets/AboutStylingSheet.css";

const aboutImages = import.meta.glob("/src/assets/Images/About/*.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});

const aboutImageArray = Object.values(aboutImages);

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <h2>About Jack</h2>
      <div className="about-imgs">
        {aboutImageArray.map((imgSrc, index) => (
          <img key={index} src={imgSrc} width="300px" height="auto" alt={`Jack - ${index + 1}`} />
        ))}
      </div>

      <p>
        Jack Monroe is a passionate visual storyteller, blending artistry with technical precision to capture moments that resonate. His work spans diverse genres, from intimate portraits to grand landscapes.
      </p>

      <h2>Public Speaking, Presentations, and Workshops</h2>
      <p>
        Jack is not only a photographer but also a dedicated educator and speaker. He regularly conducts workshops and public talks focused on:
      </p>
      <ul>
        <li>📷 <b>Photography Techniques</b>: Mastering composition, lighting, and post-processing.</li>
        <li>💼 <b>Industry Insights</b>: Understanding photography as a business and building a strong portfolio.</li>
        <li>🎭 <b>Creative Storytelling</b>: Using images to evoke emotions and narrate powerful stories.</li>
      </ul>

      <h2>Official Partners and Sponsors</h2>
      <p>Jack collaborates with top brands and creative professionals, including:</p>
      <ul>
        <li>📸 <b>Camera & Equipment Brands</b> – Supporting innovation in imaging technology.</li>
        <li>🏢 <b>Photography Studios & Agencies</b> – Partnering with industry experts.</li>
        <li>🖼️ <b>Art & Print Companies</b> – Producing high-quality prints of Jack’s work.</li>
      </ul>

      <h2>Interested in Working With Jack?</h2>
      <p>Jack is open to new collaborations, commissions, and creative projects. Whether you're looking for a skilled photographer or a strategic partnership, Jack is ready to bring your vision to life.</p>

      <Button className="learn-more-btn" onClick={() => navigate("/contact")}>
        📩 Get in touch with Jack
      </Button>
    </div>
  );
};

export default About;
