// On InvenioRDM-backed Zenodo, the legacy deposit `communities` metadata field
// no longer adds a record to a community directly — publishing instead opens a
// `community-inclusion` request that the community owner must accept. These
// helpers close that loop so a record submitted to a community Ben owns
// actually becomes a member, with no manual curation (TASK-23.09).

/**
 * Accept any still-open `community-inclusion` requests for a just-published
 * record. Returns the number accepted. Best-effort: a missing requests
 * endpoint or an already-closed request is treated as nothing-to-do.
 */
export async function acceptInclusionRequests(
  base: string,
  token: string,
  recordId: number | string,
): Promise<number> {
  const auth = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${base}/api/records/${recordId}/requests`, { headers: auth });
  if (!res.ok) return 0;
  const data = await res.json();
  let accepted = 0;
  for (const req of data.hits?.hits ?? []) {
    if (req.type !== "community-inclusion" || req.is_closed) continue;
    const act = await fetch(`${base}/api/requests/${req.id}/actions/accept`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: "{}",
    });
    if (act.ok) accepted++;
  }
  return accepted;
}
