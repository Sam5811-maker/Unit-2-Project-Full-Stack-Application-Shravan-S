package com.launchcode.frozen_pixel_alchemy.respositories;

import com.launchcode.frozen_pixel_alchemy.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
}
