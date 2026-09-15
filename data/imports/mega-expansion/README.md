# Mega expansion — Plan 009

`input.json` is UNAPPROVED source extraction, including 133 discrepancies across 12 subsets. It is not read by the catalogue importer. `reviewed.json` excludes every affected subset wholesale and contains 71 complete manufacturer families with exact secondary identity agreement. No rejected discrepancy was normalized or promoted. Existing pilot records remain unchanged, including its previously reviewed Aces and Team USA identities.

The local manufacturer workbook and Checklist Insider HTML from Plan 003 were reused; source date records refer to this review, not a fresh binary download. Workbook SHA-256 is in each manifest. Only factual extracts are stored, no downloaded image or workbook binary. Team Badges names are corroborated; its No Team/Team Logo classification comes from the manufacturer alone.

`extract-mega.py workbook.xls checklist.html output.json` regenerates UNAPPROVED candidates using the existing isolated xlrd reader. Exact named families come from the inspected retail packaging. Review is separate. `mega.ts` normalizes only reviewed.json and appends previously absent identities/variants/configurations/eligibility to the immutable Plan 005 pilot. Existing configuration/variant edge pairs win over duplicate new observations.

Published total: 1,010 entries, 10,342 variants, nine configurations and 13,807 eligibility links. Added: 451 entries, 8,699 variants, one Target/Excell configuration and 13,307 links. The source-qualified links remain PROBABLE except the pre-existing verified Red Disco family edges. Missing links are unknown, not exclusions. Target Silver was deliberately omitted because the inspected listing does not specifically support it. The other versions have only the families currently documented, not assumed shared NPP content.

Pending whole subsets: Color Blast Duals, Connections, Dual Signatures, Global Graphs, International Ink, National Heroes, New Era, Penmanship, Quad Signatures, Signatures, Trio Signatures, World Cup Posters. These must undergo discrepancy review before import. Full Mega coverage is not complete.

Collection patterns reviewed: [TCDB checklist/related sets](https://www.tcdb.com/Checklist.cfm/sid/78861/1992-Pro-Set-Thunderbirds-Are-Go), [Collectosk product filtering](https://www.collectosk.com/2026-panini-prizm-fifa-world-cup-2026-soccer-cards/). We observed their public organization, not their private schemas. BoxScout reuses its relational Release → Entry → Variant and Variant ↔ Configuration links as hidden tags.
