-- Migration: Add geolocation fields to companies table
-- Description: Adds optional fields for latitude, longitude, place_id and formatted_address
-- Status: Safe - No breaking changes, all fields are NULL-able

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS latitude FLOAT NULL COMMENT 'Latitude da localização',
ADD COLUMN IF NOT EXISTS longitude FLOAT NULL COMMENT 'Longitude da localização',
ADD COLUMN IF NOT EXISTS place_id VARCHAR(255) NULL COMMENT 'ID do lugar no Google Places',
ADD COLUMN IF NOT EXISTS formatted_address VARCHAR(500) NULL COMMENT 'Endereço formatado completo';

-- Create index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_companies_place_id ON companies(place_id);

-- Example query to find nearest companies (after data is populated)
-- SELECT * FROM companies 
-- WHERE latitude IS NOT NULL AND longitude IS NOT NULL
-- ORDER BY SQRT(POW(latitude - ?, 2) + POW(longitude - ?, 2))
-- LIMIT 10;
