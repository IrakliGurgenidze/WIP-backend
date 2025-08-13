-- Add indexes for search optimization

-- Single field indexes
CREATE INDEX IF NOT EXISTS "ApplicantProfile_graduationYear_idx" ON "ApplicantProfile"("graduationYear");
CREATE INDEX IF NOT EXISTS "ApplicantProfile_major_idx" ON "ApplicantProfile"("major");
CREATE INDEX IF NOT EXISTS "ApplicantProfile_university_idx" ON "ApplicantProfile"("university");
CREATE INDEX IF NOT EXISTS "ApplicantProfile_experienceLevel_idx" ON "ApplicantProfile"("experienceLevel");
CREATE INDEX IF NOT EXISTS "ApplicantProfile_gpa_idx" ON "ApplicantProfile"("gpa");

-- GIN indexes for array fields (PostgreSQL specific)
CREATE INDEX IF NOT EXISTS "ApplicantProfile_skills_gin_idx" ON "ApplicantProfile" USING GIN ("skills");
CREATE INDEX IF NOT EXISTS "ApplicantProfile_preferredLocations_gin_idx" ON "ApplicantProfile" USING GIN ("preferredLocations");

-- Compound index for common search patterns
CREATE INDEX IF NOT EXISTS "ApplicantProfile_search_compound_idx" ON "ApplicantProfile"("graduationYear", "experienceLevel", "gpa");