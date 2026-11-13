import { describe, expect, it } from "vitest";
import { ntroSchema } from "../../src/utils/content-schemas";
import {
  applyNtro,
  diffNtroZenodo,
  fromDeposition,
  fromRecord,
  licenseId,
  normaliseDoi,
  normaliseName,
  type NtroForZenodo,
  type ZenodoMeta,
} from "./ntro-zenodo";

const local: NtroForZenodo = {
  title: "PANIC!",
  authors: [{ name: "Ben Swift", orcid: "0000-0003-2138-5969" }, { name: "Adrian Schmidt" }],
  publication_date: "2022-08-18",
  license: "CC BY 4.0",
  upload_type: "other",
  related_works: [
    {
      relation: "isDocumentedBy",
      identifier: "10.1109/SMC58881.2025.11342470",
      type: "publication",
    },
    { relation: "isVariantFormOf", url: "https://example.org", type: "website" },
  ],
};

const remote: ZenodoMeta = {
  title: "PANIC!",
  creators: [
    { name: "Swift, Ben", orcid: "0000-0003-2138-5969", affiliation: "ANU School of Cybernetics" },
    { name: "Schmidt, Adrian", affiliation: null },
  ],
  publication_date: "2022-08-18",
  license: "cc-by-4.0",
  upload_type: "other",
  related_identifiers: [
    {
      identifier: "https://github.com/ANUcybernetics/panic",
      relation: "isSupplementTo",
      scheme: "url",
    },
    { identifier: "10.1109/smc58881.2025.11342470", relation: "isDocumentedBy", scheme: "doi" },
  ],
};

describe("normaliseName", () => {
  it("treats family-first and given-first as the same name", () => {
    expect(normaliseName("Swift, Ben")).toBe("ben swift");
    expect(normaliseName("Ben Swift")).toBe("ben swift");
  });

  it("ignores case, accents, full stops and spacing", () => {
    expect(normaliseName("Zavala - Baeza,  Marcelo")).toBe(normaliseName("marcelo zavala-baeza"));
    expect(normaliseName("Müller, J.")).toBe("j muller");
  });
});

describe("licenseId", () => {
  it("maps this repo's spelling to Zenodo's licence ids", () => {
    expect(licenseId("CC BY 4.0")).toBe("cc-by-4.0");
    expect(licenseId("CC BY-SA 4.0")).toBe("cc-by-sa-4.0");
    expect(licenseId("MIT")).toBe("mit");
  });
});

describe("normaliseDoi", () => {
  it("strips resolver prefixes and lowercases", () => {
    expect(normaliseDoi("https://doi.org/10.5281/Zenodo.1")).toBe("10.5281/zenodo.1");
    expect(normaliseDoi("doi:10.1145/3786228.3786237")).toBe("10.1145/3786228.3786237");
  });

  it("rejects things that aren't DOIs", () => {
    expect(normaliseDoi("https://slopsalon.art")).toBeUndefined();
  });
});

describe("diffNtroZenodo", () => {
  it("reports nothing when the records agree", () => {
    expect(diffNtroZenodo(local, remote)).toEqual([]);
  });

  it("reports each differing field", () => {
    const diffs = diffNtroZenodo(local, {
      title: "Panic",
      creators: [{ name: "Swift, Ben" }, { name: "Smith, Adrian" }],
      publication_date: "2022-08-19",
      license: "mit",
      upload_type: "software",
      related_identifiers: [],
    });
    expect(diffs.map((d) => d.field)).toEqual([
      "title",
      "creators",
      "orcids",
      "publication_date",
      "license",
      "upload_type",
      "related_identifiers",
    ]);
    expect(diffs.at(-1)?.message).toContain("10.1109/SMC58881.2025.11342470 (isDocumentedBy)");
  });

  it("checks creator order", () => {
    const swapped = { ...remote, creators: remote.creators.toReversed() };
    expect(diffNtroZenodo(local, swapped).map((d) => d.field)).toEqual(["creators", "orcids"]);
  });

  it("leaves an ORCID the record doesn't give unchecked", () => {
    const withOrcid = {
      ...remote,
      creators: [remote.creators[0], { name: "Schmidt, Adrian", orcid: "0000-0000-0000-0000" }],
    };
    expect(diffNtroZenodo(local, withOrcid)).toEqual([]);
  });
});

describe("fromRecord and fromDeposition", () => {
  it("read the same managed fields from both API shapes", () => {
    const common = {
      title: "T",
      creators: [{ name: "Swift, Ben" }],
      publication_date: "2025-10-15",
      related_identifiers: [],
    };
    const record = {
      metadata: { ...common, license: { id: "cc-by-4.0" }, resource_type: { type: "other" } },
    };
    const deposition = { metadata: { ...common, license: "cc-by-4.0", upload_type: "other" } };
    expect(fromRecord(record)).toEqual(fromDeposition(deposition));
  });
});

describe("applyNtro", () => {
  const metadata = {
    title: "Old title",
    description: "<p>kept</p>",
    keywords: ["kept"],
    creators: [
      {
        name: "Swift, Ben",
        affiliation: "ANU School of Cybernetics",
        orcid: "0000-0003-2138-5969",
      },
    ],
    publication_date: "2022-01-01",
    license: "mit",
    upload_type: "software",
    related_identifiers: [
      {
        identifier: "https://github.com/ANUcybernetics/panic",
        relation: "isSupplementTo",
        scheme: "url",
      },
    ],
  };

  it("changes only the fields asked for", () => {
    const out = applyNtro(metadata, local, ["title", "license"]);
    expect(out).toEqual({ ...metadata, title: "PANIC!", license: "cc-by-4.0" });
  });

  it("brings every managed field into line", () => {
    const out = applyNtro(metadata, local, [
      "title",
      "creators",
      "orcids",
      "publication_date",
      "license",
      "upload_type",
      "related_identifiers",
    ]);
    expect(diffNtroZenodo(local, fromDeposition({ metadata: out }))).toEqual([]);
    expect(out.description).toBe("<p>kept</p>");
    expect(out.keywords).toEqual(["kept"]);
  });

  it("keeps existing creators' affiliations and adds new creators family-first", () => {
    const out = applyNtro(metadata, local, ["creators"]);
    expect(out.creators).toEqual([
      {
        name: "Swift, Ben",
        affiliation: "ANU School of Cybernetics",
        orcid: "0000-0003-2138-5969",
      },
      { name: "Schmidt, Adrian" },
    ]);
  });

  it("appends missing related-work DOIs and keeps the rest", () => {
    const out = applyNtro(metadata, local, ["related_identifiers"]);
    expect(out.related_identifiers).toEqual([
      metadata.related_identifiers[0],
      {
        identifier: "10.1109/SMC58881.2025.11342470",
        relation: "isDocumentedBy",
        scheme: "doi",
        resource_type: "publication",
      },
    ]);
  });
});

describe("ntroSchema", () => {
  const record = {
    key: "k",
    title: "T",
    authors: [{ name: "Ben Swift" }],
    year: 2022,
    publication_date: "2022-08-18",
    doi: "10.5281/zenodo.1",
    upload_type: "other",
    category: "A: B",
    designation: "Standard",
    for_codes: [],
    rp_plus: {},
    checklist: {},
  };

  it("accepts a year that matches publication_date", () => {
    expect(ntroSchema.safeParse(record).success).toBe(true);
  });

  it("rejects a year that doesn't", () => {
    expect(ntroSchema.safeParse({ ...record, year: 2023 }).success).toBe(false);
  });
});
