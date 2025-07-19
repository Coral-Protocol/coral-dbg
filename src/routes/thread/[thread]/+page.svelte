<script lang="ts">
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { sessionCtx } from '$lib/threads';
	import ThreadView from '$lib/components/thread-view.svelte';

	let ctx = sessionCtx.get();
	let conn = $derived(ctx.session);
	let thread = $derived(conn?.threads[page.params['thread']]);
	let messages = $derived(conn?.messages[page.params['thread']]);
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<div class="flex h-16 items-center">
			<Sidebar.Trigger class="ml-4" />
		</div>
		{#if thread !== undefined && messages !== undefined}
			<ThreadView 
				{thread} 
				{messages} 
				host={conn?.host} 
				appId={conn?.appId} 
				privKey={conn?.privKey} 
				session={conn?.session} 
				agentId={conn?.agentId} 
			/>
		{:else}
			<p class="text-muted-foreground mt-4 text-center text-sm">Thread not found.</p>
		{/if}
	</Sidebar.Inset>
</Sidebar.Provider>
