import { ReactiveStore } from "@luna/core";

import type { components } from "@octokit/openapi-types";
export type GitHubRelease = components["schemas"]["release"];

/**
 * GitHub's API answers 60 requests an hour per IP without signing in, shared by every TIDAL on that network.
 * Client releases and Marketplace download counts go through here: answers are cached, and once GitHub says
 * the limit is reached nothing is asked until it resets.
 */
const cache = ReactiveStore.getStore("@luna/github");

let limitedUntil = 0;
const limitLoaded = cache
	.get<number>("limitedUntil")
	.then((until) => void (typeof until === "number" && (limitedUntil = Math.max(limitedUntil, until))))
	.catch(() => undefined);

const timeOf = (at: number) => new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export class GitHubLimitError extends Error {
	constructor(readonly until: number) {
		super(`GitHub allows 60 requests an hour without signing in, and that limit is used up. Try again after ${timeOf(until)}.`);
	}
}

/** Fetches a GitHub API url, unless the hourly limit is used up */
export const gitHubFetch = async (url: string): Promise<Response> => {
	await limitLoaded;
	if (Date.now() < limitedUntil) throw new GitHubLimitError(limitedUntil);
	const res = await fetch(url);
	if ((res.status === 403 || res.status === 429) && res.headers.get("x-ratelimit-remaining") === "0") {
		const reset = Number(res.headers.get("x-ratelimit-reset")) * 1000;
		limitedUntil = Number.isFinite(reset) && reset > Date.now() ? reset : Date.now() + 60 * 60 * 1000;
		await cache.set("limitedUntil", limitedUntil).catch(() => undefined);
		throw new GitHubLimitError(limitedUntil);
	}
	if (!res.ok) throw new Error(`GitHub answered ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`);
	return res;
};

// The startup update check and the Settings page both want the list, a manual refresh gets a fresh one
const releasesMaxAge = 60 * 60 * 1000;
type CachedReleases = { at: number; releases: GitHubRelease[] };
let releasesRequest: Promise<GitHubRelease[]> | undefined;

/** TIDALuna's releases, newest first: cached for an hour; unless `fresh`, the cached list is used while GitHub can't be asked */
export const fetchReleases = (fresh = false): Promise<GitHubRelease[]> => {
	if (releasesRequest !== undefined) return releasesRequest;
	const request = (async () => {
		const cached = await cache.get<CachedReleases>("releases").catch(() => undefined);
		if (!fresh && cached !== undefined && Date.now() - cached.at < releasesMaxAge) return cached.releases;
		try {
			const releases: GitHubRelease[] = await (await gitHubFetch("https://api.github.com/repos/Inrixia/TidaLuna/releases")).json();
			await cache.set<CachedReleases>("releases", { at: Date.now(), releases }).catch(() => undefined);
			return releases;
		} catch (err) {
			// A refresh the user asked for says why it failed, the startup check makes do with the last list
			if (!fresh && cached !== undefined) return cached.releases;
			throw err;
		}
	})();
	releasesRequest = request;
	void request.finally(() => releasesRequest === request && (releasesRequest = undefined)).catch(() => undefined);
	return request;
};
