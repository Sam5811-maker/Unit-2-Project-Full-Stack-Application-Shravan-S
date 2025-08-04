import { useEffect, useState } from 'react';
import Button from '../Shared/Button';
import useBookingSocket from '../../hooks/useBookingSockets'; // Custom hook for socket management

    // State variables for booking details
const Booking = () => {
    const [appointment, setAppointment] = useState('');
    const [photographer, setPhotographer] = useState('');
    const [typeOfService, setTypeOfService] = useState('');
    const [email, setEmail] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [slotTime, setSlotTime] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bookingSlot, setBookingSlot] = useState([]);
    const [photographerList, setPhotographerList] = useState([]);
    const [confirmedBookings, setConfirmedBookings] = useState([]); 

    useBookingSocket(setConfirmedBookings);

    // to fetch photographers list and their timeslot
    useEffect(() => {
        fetch('/Photographer-List.json')
            .then(response => response.json())
            .then(json => setPhotographerList(json))
            .catch(error => console.error("Error loading JSON:", error));

        setBookingSlot(["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"]);
    }, []);


        // Filter available services based on selected photographer
    const filteredServices = photographerList.find(pg => pg.name === photographer)?.services || [];

    const handleSubmit = (e) => {
    e.preventDefault();

        if (!photographer || !typeOfService || !selectedDate || !slotTime) {
        setError("All fields are required.");
        return;
        }

    const newBooking = {
      appointment,
      photographer,
      typeOfService,
      email,
      selectedDate,
      slotTime
    };

    fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking)
    })
    .then(res => res.json())
    .then(() => {
      setSuccessMessage("Booking submitted!");
      setAppointment(""); setPhotographer(""); setTypeOfService("");
      setEmail(""); setSelectedDate(""); setSlotTime("");
      setError("");
    })
    .catch(() => setError("Failed to submit booking."));
    };

    const handleCancelBooking = (id) => {
        const confirmed = window.confirm("Are you sure you want to cancel?");
        if (confirmed) {
            setConfirmedBookings(confirmedBookings.filter((booking) => booking.id !== id));
        }
    };

    const handleEditBooking = (id) => {
        const updatedBookings = confirmedBookings.map((booking) => 
            booking.id === id ? { ...booking, appointment: prompt("Edit Appointment Title:", booking.appointment) } : booking
        );
        setConfirmedBookings(updatedBookings);
    };

    return (
        <div className="booking-container">
            <h2>Book Your Photography Session</h2>
            <form onSubmit={handleSubmit} className="booking-form">
                <label>Appointment Title:</label>
                <input 
                    type="text" 
                    value={appointment} 
                    onChange={(e) => setAppointment(e.target.value)} 
                    placeholder="Enter title"
                    required
                />

                <label>Select Photographer:</label>
                <select value={photographer} onChange={(e) => setPhotographer(e.target.value)}>
                    <option value="">Select a Photographer</option>
                    {photographerList.map((pg, index) => (
                        <option key={index} value={pg.name}>{pg.name}</option>
                    ))}
                </select>

                <label>Photography Service Type:</label>
                <select value={typeOfService} onChange={(e) => setTypeOfService(e.target.value)}>
                    <option value="">Select Service Type</option>
                    {filteredServices.map((service, index) => (
                        <option key={index} value={service.type_of_service_offered}>
                            {service.type_of_service_offered}
                        </option>
                    ))}
                </select>

                <label>Choose Date:</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

                <label>Choose Time:</label>
                <select value={slotTime} onChange={(e) => setSlotTime(e.target.value)}>
                    <option value="">Select a Time Slot</option>
                    {bookingSlot.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>

                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

                {error && <p className="error-message">{error}</p>}

                <div className="action-buttons">
                    <Button type="submit">✔ Ready to Get Snapped</Button>
                </div>
            </form>

            {/* Booking Confirmation List */}
            {confirmedBookings.length > 0 && (
                <div className="confirmation-list">
                    <h3>Confirmed Bookings</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Title</th>
                                <th>Photographer</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {confirmedBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td><strong>{booking.appointment}</strong></td>
                                    <td>{booking.photographer}</td>
                                    <td>{booking.typeOfService}</td>
                                    <td>{booking.selectedDate}</td>
                                    <td>{booking.slotTime}</td>
                                    <td>
                                        <Button onClick={() => handleEditBooking(booking.id)}>✏ Edit</Button>
                                        <Button onClick={() => handleCancelBooking(booking.id)}>❌ Cancel</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>                  
                </div>
            )}
        </div>
    );
};

export default Booking;
