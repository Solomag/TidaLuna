import assert from "node:assert/strict";
import test from "node:test";
import { store } from "oby";
import { availablePlugins, installedPlugins, matchingPluginNames, watchInstalledPlugins } from "./installedPlugins";

const item = (name: string, installed = true) => ({ name, installed });
const z = item("Zulu");
const a = item("alpha");
const core = new Set(["core"]);
const plugins = [z, item("store", false), item("core"), a];

test("updates an already open list after installing its first plugin and after uninstall", async () => {
	const registry = store<Record<string, ReturnType<typeof item>>>({});
	let names: string[] = [];
	const dispose = watchInstalledPlugins(registry, core, false, (plugins) => {
		names = plugins.map((plugin) => plugin.name);
	});
	try {
		assert.deepEqual(names, []);
		registry.preview = item("Preview", false);
		await Promise.resolve();
		assert.deepEqual(names, []);
		registry.preview.installed = true;
		await Promise.resolve();
		assert.deepEqual(names, ["Preview"]);
		delete registry.preview;
		await Promise.resolve();
		assert.deepEqual(names, []);
	} finally {
		dispose();
	}
});

test("sorts installed non-core plugins in either direction without changing registry order", () => {
	assert.deepEqual(installedPlugins(plugins, core, false), [a, z]);
	assert.deepEqual(installedPlugins(plugins, core, true), [z, a]);
	assert.equal(plugins[0], z);
	assert.deepEqual(installedPlugins([], core, false), []);
});

test("matches partial names ignoring case and surrounding whitespace", () => {
	const list = installedPlugins(plugins, core, true);
	assert.deepEqual([...matchingPluginNames(list, "  LP  ")], [a]);
	assert.deepEqual([...matchingPluginNames(list, "   ")], [z, a]);
	assert.equal(matchingPluginNames(list, "store").size, 0);
});

test("lists each store plugin once, leaving out installed names and core plugins", () => {
	const listing = (name: string, installed = false, isDev = false) => ({ name, installed, isDev });
	const installed = [listing("Installed", true)];
	const fromOtherStore = listing("Installed");
	const beta = listing("beta");
	const betaAgain = listing("beta");
	const betaDev = listing("beta", false, true);
	const alpha = listing("Alpha");
	const listed = [fromOtherStore, beta, betaAgain, betaDev, listing("core"), alpha];
	assert.deepEqual(availablePlugins(listed, installed, core, false), [alpha, beta, betaDev]);
	assert.deepEqual(availablePlugins(listed, installed, core, true), [beta, betaDev, alpha]);
});
