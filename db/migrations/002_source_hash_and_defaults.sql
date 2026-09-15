-- Preserve optional manufacturer source hashes present in the generated input.
ALTER TABLE catalogue.sources ADD COLUMN sha256 text CHECK (sha256 IS NULL OR sha256 ~ '^[a-f0-9]{64}$');
CREATE FUNCTION catalogue.check_default() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,catalogue AS $$
DECLARE parent_id text;
BEGIN
 IF TG_TABLE_NAME='entries' THEN parent_id=COALESCE(NEW.id,OLD.id); ELSE parent_id=COALESCE(NEW."entryId",OLD."entryId"); END IF;
 IF EXISTS(SELECT 1 FROM catalogue.entries WHERE id=parent_id) AND NOT EXISTS(SELECT 1 FROM catalogue.variants WHERE "entryId"=parent_id AND "isDefault") THEN RAISE EXCEPTION 'Entry missing default variant'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER entry_default AFTER INSERT OR UPDATE ON catalogue.entries DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION catalogue.check_default();
CREATE CONSTRAINT TRIGGER variant_default AFTER INSERT OR UPDATE OR DELETE ON catalogue.variants DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION catalogue.check_default();
REVOKE ALL ON FUNCTION catalogue.check_default() FROM PUBLIC;
