-- Plan 006: portable PostgreSQL 17 catalogue. No auth or future market tables.
CREATE SCHEMA catalogue;
REVOKE ALL ON SCHEMA catalogue FROM PUBLIC;
CREATE TYPE catalogue.verification AS ENUM ('RAW','CANDIDATE','REVIEWED','VERIFIED');
CREATE TYPE catalogue.confidence AS ENUM ('UNKNOWN','PROBABLE','VERIFIED');
CREATE TYPE catalogue.entry_type AS ENUM ('BASE','INSERT','AUTOGRAPH','RELIC','MEMORABILIA','VARIATION','OTHER');
CREATE TYPE catalogue.numbering AS ENUM ('NUMBERED','UNNUMBERED','UNKNOWN');
CREATE TYPE catalogue.eligibility_status AS ENUM ('INCLUDED','EXCLUDED','UNKNOWN','CONFLICTING');
CREATE TYPE catalogue.source_kind AS ENUM ('PANINI_OFFICIAL','OFFICIAL_SELL_SHEET','EXACT_RETAILER','SECONDARY');
CREATE TYPE catalogue.link_kind AS ENUM ('EXPLICIT_UPC_FAMILY','MATCHING_UPC_CONTENTS','FAMILY_ONLY','RELEASE_ONLY');
CREATE TYPE catalogue.claim_semantics AS ENUM ('GUARANTEED','PER_BOX_AVERAGE','PUBLISHED_ODDS','POSSIBLE');
CREATE TABLE catalogue.releases (
 "id" text primary key,
 "name" text not null,
 "year" integer not null,
 "manufacturer" text not null,
 "provenance" jsonb not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.retailer_configurations (
 "id" text primary key,
 "releaseId" text not null,
 "name" text not null,
 "sku" text,
 "upc" text,
 "identificationStatus" catalogue.confidence not null,
 "nppMappingStatus" catalogue.confidence not null,
 "packsPerBox" integer,
 "cardsPerPack" integer,
 "provenance" jsonb not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.products (
 "id" text primary key,
 "slug" text not null unique,
 "releaseId" text not null,
 "configurationId" text not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.entries (
 "id" text primary key,
 "releaseId" text not null,
 "cardNumber" text not null,
 "playerName" text not null,
 "country" text not null,
 "subset" text not null,
 "sortOrder" integer not null,
 "verificationState" catalogue.verification not null,
 "checkedAt" date not null,
 "discrepancyIds" jsonb not null,
 "provenance" jsonb not null,
 "image" jsonb not null,
 "entryType" catalogue.entry_type not null,
 "variationOfEntryId" text,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.variants (
 "id" text primary key,
 "entryId" text not null,
 "releaseId" text not null,
 "parallelName" text not null,
 "isDefault" boolean not null,
 "numbering" catalogue.numbering not null,
 "serialTotal" integer,
 "autograph" boolean not null,
 "relic" boolean,
 "verificationState" catalogue.verification not null,
 "locator" text not null,
 "checkedAt" date not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.configurations (
 "id" text primary key,
 "releaseId" text not null,
 "name" text not null,
 "confidence" catalogue.confidence not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.eligibility (
 "id" text primary key,
 "configurationId" text not null,
 "variantId" text not null,
 "releaseId" text not null,
 "status" catalogue.eligibility_status not null,
 "confidence" catalogue.confidence not null,
 "locator" text not null,
 "rationale" text not null,
 "checkedAt" date not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.sources (
 "id" text primary key,
 "name" text not null,
 "url" text not null,
 "checkedAt" date not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.evidence (
 "id" text primary key,
 "sourceKind" catalogue.source_kind not null,
 "sourceName" text not null,
 "sourceUrl" text not null,
 "checkedAt" date not null,
 "verificationState" catalogue.verification not null,
 "locator" text not null,
 "scope" text not null,
 "statement" text not null,
 "qualification" text not null,
 "observedAt" timestamptz,
 "sourceId" text,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.listings (
 "id" text primary key,
 "productId" text not null,
 "configurationId" text not null,
 "retailerName" text not null,
 "listingUrl" text not null,
 "variantOfferUrl" text not null,
 "variantId" text not null,
 "retailerSku" jsonb not null,
 "reportedUpc" jsonb not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.assessments (
 "productId" text primary key,
 "family" text not null,
 "reviewedStatus" catalogue.confidence not null,
 "rationale" text not null,
 "gaps" jsonb not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.configuration_links (
 "productId" text not null,
 "evidenceId" text not null,
 "family" text not null,
 "upc" text,
 "linkKind" catalogue.link_kind not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.specifications (
 "id" text primary key,
 "productId" text not null,
 "subject" jsonb not null,
 "evidenceId" text not null,
 "packsPerBox" integer not null,
 "cardsPerPack" integer not null,
 "statedCardsPerBox" integer,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.claims (
 "id" text primary key,
 "productId" text not null,
 "subject" jsonb not null,
 "evidenceId" text not null,
 "item" text not null,
 "quantity" integer,
 "unit" text not null,
 "claimSemantics" catalogue.claim_semantics,
 "publishedOdds" text,
 "includes" jsonb not null,
 "conflictIds" jsonb not null,
 "qualification" text not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.prices (
 "id" text primary key,
 "retailerListingId" text not null,
 "productId" text not null,
 "amountMinor" integer not null,
 "currency" text not null,
 "observedAt" timestamptz not null,
 "observationType" text not null,
 "saleUnit" text not null,
 "availability" text not null,
 "availabilityNote" text not null,
 "taxIncluded" text not null,
 "shippingIncluded" text not null,
 "provenance" jsonb not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.source_links (
 "id" text primary key,
 "name" text not null,
 "url" text not null
);
CREATE TABLE catalogue.entry_sources (
 "entryId" text not null,
 "sourceId" text not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.variant_sources (
 "variantId" text not null,
 "sourceId" text not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.configuration_sources (
 "configurationId" text not null,
 "sourceId" text not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.eligibility_sources (
 "eligibilityId" text not null,
 "sourceId" text not null,
 position integer NOT NULL CHECK (position >= 0)
);
CREATE TABLE catalogue.claim_conflicts (
 "claimId" text not null,
 "otherId" text not null
);
CREATE TABLE catalogue.identifier_evidence (
 "listingId" text not null,
 "kind" text not null,
 "evidenceId" text not null
);
ALTER TABLE catalogue.retailer_configurations ADD FOREIGN KEY ("releaseId") REFERENCES catalogue.releases("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.products ADD FOREIGN KEY ("releaseId") REFERENCES catalogue.releases("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.entries ADD FOREIGN KEY ("releaseId") REFERENCES catalogue.releases("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.configurations ADD FOREIGN KEY ("releaseId") REFERENCES catalogue.releases("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.products ADD FOREIGN KEY ("configurationId") REFERENCES catalogue.retailer_configurations("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.entries ADD UNIQUE (id,"releaseId");
ALTER TABLE catalogue.variants ADD UNIQUE (id,"releaseId");
ALTER TABLE catalogue.configurations ADD UNIQUE (id,"releaseId");
ALTER TABLE catalogue.entries ADD UNIQUE ("releaseId",subset,"cardNumber");
ALTER TABLE catalogue.entries ADD CHECK (length(trim("playerName")) > 0 AND length(trim("cardNumber")) > 0 AND jsonb_array_length(provenance)>0);
ALTER TABLE catalogue.entries ADD FOREIGN KEY ("variationOfEntryId","releaseId") REFERENCES catalogue.entries(id,"releaseId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.entries ADD CHECK ("variationOfEntryId" IS NULL OR "variationOfEntryId" <> id);
ALTER TABLE catalogue.variants ADD FOREIGN KEY ("entryId","releaseId") REFERENCES catalogue.entries(id,"releaseId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.variants ADD CHECK ((numbering='NUMBERED' AND "serialTotal" IS NOT NULL AND "serialTotal">0) OR (numbering IN ('UNNUMBERED','UNKNOWN') AND "serialTotal" IS NULL));
ALTER TABLE catalogue.variants ADD CHECK (NOT "isDefault" OR id="entryId");
CREATE UNIQUE INDEX variant_default ON catalogue.variants("entryId") WHERE "isDefault";
ALTER TABLE catalogue.eligibility ADD UNIQUE ("configurationId","variantId");
ALTER TABLE catalogue.eligibility ADD FOREIGN KEY ("variantId","releaseId") REFERENCES catalogue.variants(id,"releaseId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.eligibility ADD FOREIGN KEY ("configurationId","releaseId") REFERENCES catalogue.configurations(id,"releaseId") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.listings ADD FOREIGN KEY ("productId") REFERENCES catalogue.products("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.assessments ADD FOREIGN KEY ("productId") REFERENCES catalogue.products("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.configuration_links ADD FOREIGN KEY ("productId") REFERENCES catalogue.products("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.specifications ADD FOREIGN KEY ("productId") REFERENCES catalogue.products("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.claims ADD FOREIGN KEY ("productId") REFERENCES catalogue.products("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.prices ADD FOREIGN KEY ("productId") REFERENCES catalogue.products("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.listings ADD FOREIGN KEY ("configurationId") REFERENCES catalogue.retailer_configurations("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.prices ADD FOREIGN KEY ("retailerListingId") REFERENCES catalogue.listings("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.configuration_links ADD FOREIGN KEY ("evidenceId") REFERENCES catalogue.evidence("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.specifications ADD FOREIGN KEY ("evidenceId") REFERENCES catalogue.evidence("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.claims ADD FOREIGN KEY ("evidenceId") REFERENCES catalogue.evidence("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.identifier_evidence ADD FOREIGN KEY ("evidenceId") REFERENCES catalogue.evidence("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.entry_sources ADD FOREIGN KEY ("entryId") REFERENCES catalogue.entries("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.entry_sources ADD FOREIGN KEY ("sourceId") REFERENCES catalogue.source_links("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.entry_sources ADD PRIMARY KEY ("entryId",position);
ALTER TABLE catalogue.entry_sources ADD UNIQUE ("entryId","sourceId");
ALTER TABLE catalogue.variant_sources ADD FOREIGN KEY ("variantId") REFERENCES catalogue.variants("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.variant_sources ADD FOREIGN KEY ("sourceId") REFERENCES catalogue.sources("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.variant_sources ADD PRIMARY KEY ("variantId",position);
ALTER TABLE catalogue.variant_sources ADD UNIQUE ("variantId","sourceId");
ALTER TABLE catalogue.configuration_sources ADD FOREIGN KEY ("configurationId") REFERENCES catalogue.configurations("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.configuration_sources ADD FOREIGN KEY ("sourceId") REFERENCES catalogue.sources("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.configuration_sources ADD PRIMARY KEY ("configurationId",position);
ALTER TABLE catalogue.configuration_sources ADD UNIQUE ("configurationId","sourceId");
ALTER TABLE catalogue.eligibility_sources ADD FOREIGN KEY ("eligibilityId") REFERENCES catalogue.eligibility("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.eligibility_sources ADD FOREIGN KEY ("sourceId") REFERENCES catalogue.sources("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.eligibility_sources ADD PRIMARY KEY ("eligibilityId",position);
ALTER TABLE catalogue.eligibility_sources ADD UNIQUE ("eligibilityId","sourceId");
ALTER TABLE catalogue.claim_conflicts ADD FOREIGN KEY ("claimId") REFERENCES catalogue.claims("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.claim_conflicts ADD FOREIGN KEY ("otherId") REFERENCES catalogue.claims("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.claim_conflicts ADD PRIMARY KEY ("claimId","otherId");
ALTER TABLE catalogue.identifier_evidence ADD FOREIGN KEY ("listingId") REFERENCES catalogue.listings("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE catalogue.identifier_evidence ADD PRIMARY KEY ("listingId",kind,"evidenceId");
ALTER TABLE catalogue.configuration_links ADD PRIMARY KEY ("productId",position);
ALTER TABLE catalogue.prices ADD CHECK ("amountMinor">=0 AND currency ~ '^[A-Z]{3}$' AND "observationType"='LISTING_PRICE' AND "saleUnit"='ONE_SEALED_BOX' AND availability IN ('IN_STOCK','OUT_OF_STOCK','UNKNOWN') AND "taxIncluded" IN ('YES','NO','UNKNOWN') AND "shippingIncluded" IN ('YES','NO','UNKNOWN'));
ALTER TABLE catalogue.claims ADD CHECK (subject->>'scope' IN ('MATCHING_UPC','CONFIGURATION_FAMILY') AND length(subject->>'value')>0);
ALTER TABLE catalogue.specifications ADD CHECK (subject->>'scope' IN ('MATCHING_UPC','CONFIGURATION_FAMILY') AND length(subject->>'value')>0);
ALTER TABLE catalogue.claims ADD CHECK ((quantity IS NULL OR quantity>=0) AND unit='PER_BOX');
ALTER TABLE catalogue.specifications ADD CHECK ("packsPerBox">0 AND "cardsPerPack">0 AND ("statedCardsPerBox" IS NULL OR "statedCardsPerBox">0));
CREATE INDEX variants_parent ON catalogue.variants("entryId");
CREATE INDEX entries_release ON catalogue.entries("releaseId", "sortOrder");
CREATE INDEX prices_latest ON catalogue.prices("retailerListingId", "observedAt" DESC);

CREATE TABLE catalogue.publications (revision text PRIMARY KEY CHECK (revision ~ '^[a-f0-9]{64}$'), "createdAt" timestamptz NOT NULL DEFAULT now(), counts jsonb NOT NULL, "reviewedBy" text NOT NULL CHECK (length(trim("reviewedBy"))>0));
CREATE TABLE catalogue.imports (digest text PRIMARY KEY, "importedAt" timestamptz NOT NULL DEFAULT now(), "reviewedBy" text NOT NULL);
CREATE FUNCTION catalogue.validate_graph() RETURNS void LANGUAGE plpgsql SET search_path=pg_catalog,catalogue AS $$
BEGIN
 IF EXISTS (SELECT 1 FROM catalogue.entries e WHERE NOT EXISTS (SELECT 1 FROM catalogue.variants v WHERE v."entryId"=e.id AND v."isDefault")) THEN RAISE EXCEPTION 'Entry missing default variant'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.entries e JOIN catalogue.entries p ON p.id=e."variationOfEntryId" WHERE e."entryType"<>'VARIATION' OR p."entryType"<>'BASE') THEN RAISE EXCEPTION 'Invalid variation parent'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.variants v WHERE NOT EXISTS(SELECT 1 FROM catalogue.variant_sources s WHERE s."variantId"=v.id)) OR EXISTS (SELECT 1 FROM catalogue.configurations c WHERE NOT EXISTS(SELECT 1 FROM catalogue.configuration_sources s WHERE s."configurationId"=c.id)) OR EXISTS (SELECT 1 FROM catalogue.eligibility e WHERE NOT EXISTS(SELECT 1 FROM catalogue.eligibility_sources s WHERE s."eligibilityId"=e.id)) THEN RAISE EXCEPTION 'Missing source reference'; END IF;
 IF EXISTS (SELECT 1 FROM catalogue.entries e WHERE jsonb_array_length(e.provenance)<>(SELECT count(*) FROM catalogue.entry_sources s WHERE s."entryId"=e.id)) THEN RAISE EXCEPTION 'Entry provenance reference mismatch'; END IF;
END $$;
CREATE FUNCTION catalogue.check_graph_trigger() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,catalogue AS $$ BEGIN PERFORM catalogue.validate_graph(); RETURN NULL; END $$;
CREATE CONSTRAINT TRIGGER publication_graph AFTER INSERT OR UPDATE ON catalogue.publications DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION catalogue.check_graph_trigger();
-- Read-only non-login role: the trusted operator SET ROLEs for export, no second secret.
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='boxscout_catalogue_reader') THEN CREATE ROLE boxscout_catalogue_reader NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF; END $$;
GRANT boxscout_catalogue_reader TO CURRENT_USER;
GRANT USAGE ON SCHEMA catalogue TO boxscout_catalogue_reader;
REVOKE ALL ON ALL TABLES IN SCHEMA catalogue FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA catalogue FROM PUBLIC;
ALTER TABLE catalogue.releases ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.releases TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.releases FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.retailer_configurations ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.retailer_configurations TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.retailer_configurations FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.products ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.products TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.products FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.entries ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.entries TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.entries FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.variants ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.variants TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.variants FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.configurations ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.configurations TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.configurations FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.eligibility ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.eligibility TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.eligibility FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.sources ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.sources TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.sources FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.evidence ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.evidence TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.evidence FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.listings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.listings TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.listings FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.assessments ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.assessments TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.assessments FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.configuration_links ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.configuration_links TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.configuration_links FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.specifications ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.specifications TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.specifications FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.claims ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.claims TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.claims FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.prices ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.prices TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.prices FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.source_links ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.source_links TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.source_links FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.entry_sources ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.entry_sources TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.entry_sources FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.variant_sources ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.variant_sources TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.variant_sources FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.configuration_sources ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.configuration_sources TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.configuration_sources FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.eligibility_sources ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.eligibility_sources TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.eligibility_sources FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.claim_conflicts ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.claim_conflicts TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.claim_conflicts FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.identifier_evidence ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.identifier_evidence TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.identifier_evidence FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.publications ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON catalogue.publications TO boxscout_catalogue_reader;
CREATE POLICY catalogue_read ON catalogue.publications FOR SELECT TO boxscout_catalogue_reader USING (true);
ALTER TABLE catalogue.imports ENABLE ROW LEVEL SECURITY;
