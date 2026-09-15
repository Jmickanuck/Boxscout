-- Parallel-only identities must still have at least one actual collectible edition.
CREATE OR REPLACE FUNCTION catalogue.check_default() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,catalogue AS $$
DECLARE parent_id text;
BEGIN
 IF TG_TABLE_NAME='entries' THEN parent_id=COALESCE(NEW.id,OLD.id); ELSE parent_id=COALESCE(NEW."entryId",OLD."entryId"); END IF;
 IF EXISTS(SELECT 1 FROM catalogue.entries WHERE id=parent_id) AND NOT EXISTS(SELECT 1 FROM catalogue.variants WHERE "entryId"=parent_id) THEN RAISE EXCEPTION 'Entry missing collectible variant'; END IF;
 IF EXISTS(SELECT 1 FROM catalogue.entries WHERE id=parent_id AND "entryType"='BASE') AND NOT EXISTS(SELECT 1 FROM catalogue.variants WHERE "entryId"=parent_id AND "isDefault") THEN RAISE EXCEPTION 'Entry missing default variant'; END IF;
 RETURN NULL;
END $$;
CREATE OR REPLACE FUNCTION catalogue.validate_graph() RETURNS void LANGUAGE plpgsql SET search_path=pg_catalog,catalogue AS $$
BEGIN
 IF EXISTS (SELECT 1 FROM catalogue.entries e WHERE NOT EXISTS (SELECT 1 FROM catalogue.variants v WHERE v."entryId"=e.id)) THEN RAISE EXCEPTION 'Entry missing collectible variant'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.entries e WHERE e."entryType"='BASE' AND NOT EXISTS (SELECT 1 FROM catalogue.variants v WHERE v."entryId"=e.id AND v."isDefault")) THEN RAISE EXCEPTION 'Entry missing default variant'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.entries e JOIN catalogue.entries p ON p.id=e."variationOfEntryId" WHERE e."entryType"<>'VARIATION' OR p."entryType"<>'BASE') THEN RAISE EXCEPTION 'Invalid variation parent'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.variants v WHERE NOT EXISTS(SELECT 1 FROM catalogue.variant_sources s WHERE s."variantId"=v.id)) OR EXISTS (SELECT 1 FROM catalogue.configurations c WHERE NOT EXISTS(SELECT 1 FROM catalogue.configuration_sources s WHERE s."configurationId"=c.id)) OR EXISTS (SELECT 1 FROM catalogue.eligibility e WHERE NOT EXISTS(SELECT 1 FROM catalogue.eligibility_sources s WHERE s."eligibilityId"=e.id)) THEN RAISE EXCEPTION 'Missing source reference'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.entries e WHERE jsonb_array_length(e.provenance)<>(SELECT count(*) FROM catalogue.entry_sources s WHERE s."entryId"=e.id)) THEN RAISE EXCEPTION 'Entry provenance reference mismatch'; END IF;
END $$;
