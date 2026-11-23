/** Plugin name without its npm scope ("@author/"), for display and sorting */
export const displayName = (name: string) => name.replace(/^@[^/]+\//, "");

export const byName = new Intl.Collator(undefined, { sensitivity: "base" });
export const compareNames = (a: string, b: string) => byName.compare(displayName(a), displayName(b)) || byName.compare(a, b);
