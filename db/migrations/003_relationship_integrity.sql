-- Complete relationship and source-shape enforcement; nullable uncertainty stays valid.
ALTER TABLE catalogue.variants ADD UNIQUE ("entryId","parallelName");
ALTER TABLE catalogue.retailer_configurations ADD UNIQUE (id,"releaseId");
ALTER TABLE catalogue.products ADD FOREIGN KEY ("configurationId","releaseId") REFERENCES catalogue.retailer_configurations(id,"releaseId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.products ADD UNIQUE (id,"configurationId");
ALTER TABLE catalogue.listings ADD FOREIGN KEY ("productId","configurationId") REFERENCES catalogue.products(id,"configurationId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.listings ADD UNIQUE (id,"productId");
ALTER TABLE catalogue.prices ADD FOREIGN KEY ("retailerListingId","productId") REFERENCES catalogue.listings(id,"productId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.claims ADD CHECK (subject ? 'scope' AND subject ? 'value' AND jsonb_typeof(subject->'value')='string');
ALTER TABLE catalogue.specifications ADD CHECK (subject ? 'scope' AND subject ? 'value' AND jsonb_typeof(subject->'value')='string');
ALTER TABLE catalogue.sources ADD CHECK (url ~ '^https?://' AND length(trim(name))>0);
ALTER TABLE catalogue.evidence ADD CHECK ("sourceUrl" ~ '^https?://' AND length(trim("sourceName"))>0);
ALTER TABLE catalogue.prices ADD CHECK (provenance ? 'sourceUrl' AND provenance ? 'checkedAt' AND provenance ? 'verificationState');
-- Non-public canonical rows may be read only by the operator's explicit reader role.
-- No anon/authenticated privileges, even if those Supabase roles exist.
DO $$ DECLARE role_name text; BEGIN
 FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
  IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname=role_name) THEN
   EXECUTE format('REVOKE ALL ON SCHEMA catalogue FROM %I',role_name);
   EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA catalogue FROM %I',role_name);
   EXECUTE format('REVOKE ALL ON public.boxscout_migrations FROM %I',role_name);
  END IF;
 END LOOP;
END $$;
