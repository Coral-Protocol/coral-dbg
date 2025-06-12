<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Session } from '$lib/session.svelte';
	import { socketCtx } from '$lib/threads';
	import { PersistedState } from 'runed';
	import { toast } from 'svelte-sonner';

	let socket = socketCtx.get();

	let host = new PersistedState('host', '127.0.0.1:5555');
	let appId = new PersistedState('appId', 'appId');
	let privKey = new PersistedState('privKey', 'privKey');
	let session = new PersistedState('session', 'session1');
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<main></main>
	</Sidebar.Inset>
</Sidebar.Provider>
