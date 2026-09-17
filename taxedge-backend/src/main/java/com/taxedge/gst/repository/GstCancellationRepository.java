package com.taxedge.gst.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.GstCancellation;

public interface GstCancellationRepository
        extends JpaRepository<GstCancellation, String> {
}