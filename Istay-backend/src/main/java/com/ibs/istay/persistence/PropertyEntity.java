package com.ibs.istay.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "property")
public class PropertyEntity {

    @Id
    @Column(name = "property_id", nullable = false, length = 64)
    private String propertyId;

    @Column(nullable = false)
    private String name;

    protected PropertyEntity() {
    }

    public PropertyEntity(String propertyId, String name) {
        this.propertyId = propertyId;
        this.name = name;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public String getName() {
        return name;
    }
}
