-- Review state and publication approval are independent of factual confidence.
CREATE FUNCTION catalogue.check_reviewed_publication() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,catalogue AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM catalogue.entries WHERE "verificationState" IN ('RAW','CANDIDATE')) OR EXISTS(SELECT 1 FROM catalogue.variants WHERE "verificationState" IN ('RAW','CANDIDATE')) THEN RAISE EXCEPTION 'Unreviewed entry or variant cannot publish'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER publication_review BEFORE INSERT OR UPDATE ON catalogue.publications FOR EACH ROW EXECUTE FUNCTION catalogue.check_reviewed_publication();
REVOKE ALL ON FUNCTION catalogue.check_reviewed_publication() FROM PUBLIC;
