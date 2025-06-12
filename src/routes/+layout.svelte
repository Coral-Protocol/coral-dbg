<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { socketCtx, type Agent, type Message, type Thread } from '$lib/threads';
	import { SvelteMap } from 'svelte/reactivity';
	import '../app.css';

	let { children } = $props();

	let socket = $state({
		session: null,
		registry: null
	});
	socketCtx.set(socket);
</script>

<Toaster />
{@render children()}
