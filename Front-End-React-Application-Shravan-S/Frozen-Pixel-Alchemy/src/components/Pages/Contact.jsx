import { useState } from "react";
import Button from '../Shared/Button';
import '../../stylesheets/ContactStylingSheet.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        if (!name || !email || !message) {
            setError("Please fill in all fields.");
            return;
        }

        // console.log("Form submitted:", formData);
        setSuccessMessage("Message sent successfully!");
        
        setTimeout(() => {
            setFormData({ name: "", email: "", message: "" });
            setSuccessMessage("");
            setError("");
        }, 2000);
    };

    return (
        <div className="contact-container">
            <h2>Contact Me</h2>
            <form onSubmit={handleSubmit} className="contact-form">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />

                <label>Message:</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type your message..." required />

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <Button type="submit">📩 Send Message</Button>
            </form>
        </div>
    );
};

export default Contact;
