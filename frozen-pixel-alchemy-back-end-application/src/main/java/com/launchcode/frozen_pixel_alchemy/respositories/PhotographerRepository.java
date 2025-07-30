package com.launchcode.frozen_pixel_alchemy.respositories;

import com.launchcode.frozen_pixel_alchemy.models.Photographer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotographerRepository extends JpaRepository<Photographer, Integer> {
}
