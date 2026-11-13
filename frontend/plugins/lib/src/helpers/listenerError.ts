import * as core from "@luna/core";
import type { Tracer } from "@luna/core";

/**
 * Build an onError handler for an event emitter.
 *
 * registerEmitter hands the same onError to every listener and never says which one threw, so a
 * plugin's broken listener was recorded against whichever module owns the emitter. The stack still
 * names the bundle that threw, so attribute by that and fall back to the emitter when it does not.
 *
 * LunaPlugin is read through the namespace so this still works against a core without fromStack.
 */
export const listenerError =
	(trace: Tracer, context: string) =>
	(err: unknown): void => {
		const message = (<Error>err)?.message ?? String(err);
		const culprit = core.LunaPlugin?.fromStack?.((<Error>err)?.stack);
		if (culprit !== undefined) {
			// A runtime fault in someone's listener, not a failure to load
			culprit.reportRuntimeError(`${context}: ${message}`);
			console.error(`[${culprit.name}] ${context}:`, err);
			return;
		}
		trace.err.withContext(context)(err);
	};
