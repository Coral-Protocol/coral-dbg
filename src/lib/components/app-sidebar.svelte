<script lang="ts" module>
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import Logo from '$lib/icons/logo.svelte';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { sessionCtx, type Agent, type RegistryAgent } from '$lib/threads';
	import { ChevronDown, MoonIcon, Plus, PlusIcon, RefreshCw, SunIcon } from '@lucide/svelte';
	import Badge from './ui/badge/badge.svelte';
	import { cn } from '$lib/utils';
	import CreateSession from './create-session.svelte';
	import { PersistedState, useDebounce } from 'runed';
	import { Session } from '$lib/session.svelte';
	import { onMount, tick } from 'svelte';
	import { socketCtx } from '$lib/socket.svelte';
	import { toggleMode } from 'mode-watcher';
	import { page } from '$app/state';

	let sessCtx = sessionCtx.get();
	let tools = socketCtx.get();
	let conn = $derived(sessCtx.session);

	let threadName = $state('');
	let participants: string[] = $state([]);

	let host = new PersistedState('host', '127.0.0.1:5555');
	let appId = new PersistedState('appId', 'appId');
	let privKey = new PersistedState('privKey', 'privKey');

	let connecting = $state(false);
	let error: string | null = $state(null);

	let createSessionOpen = $state(false);

	const refreshAgents = async () => {
		try {
			connecting = true;
			sessCtx.connection = null;
			error = null;
			sessCtx.registry = null;
			const agents = (await fetch(`http://${host.current}/api/v1/registry`).then((res) =>
				res.json()
			)) as RegistryAgent[];
			sessCtx.registry = Object.fromEntries(agents.map((agent) => [agent.id, agent]));

			const sessions = (await fetch(`http://${host.current}/api/v1/sessions`).then((res) =>
				res.json()
			)) as string[];
			sessCtx.sessions = sessions;

			sessCtx.connection = {
				host: host.current,
				appId: appId.current,
				privacyKey: privKey.current
			};

			connecting = false;
		} catch (e) {
			connecting = false;
			sessCtx.registry = null;
			error = `${e}`;
		}
	};

	onMount(() => refreshAgents());

	const debouncedRefresh = useDebounce(() => refreshAgents(), 400);
	const inputRefresh = () => {
		connecting = true;
		debouncedRefresh();
	};
</script>

<CreateSession bind:open={createSessionOpen} agents={sessCtx.registry ?? {}} />

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.MenuButton class="text-lg font-bold">
			{#snippet child({ props })}
				<a href="/" {...props}><Logo class="text-foreground" />coral-studio</a>
			{/snippet}
		</Sidebar.MenuButton>
		<Sidebar.Group class="-mt-3">
			<Sidebar.GroupLabel class="text-sidebar-foreground flex flex-row gap-1 pr-0 text-sm">
				<span>Connection</span>
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger disabled={error === null} class="flex-grow text-right ">
							<span
								class={cn('text-muted-foreground text-sm font-normal', error && 'text-destructive')}
							>
								{#if error}
									Error
								{:else if sessCtx.registry}
									{Object.keys(sessCtx.registry).length} agents
								{/if}
							</span>
						</Tooltip.Trigger>
						<Tooltip.Content><p>{error}</p></Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
				<Button
					size="icon"
					variant="outline"
					class="size-7"
					disabled={connecting}
					onclick={() => refreshAgents()}
				>
					<RefreshCw class={cn('size-3', connecting && 'animate-spin')} />
				</Button>
			</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Input placeholder="host" bind:value={host.current} oninput={inputRefresh} />
					<div class="flex flex-row gap-1">
						<Input placeholder="app id" bind:value={appId.current} oninput={inputRefresh} />
						<Input placeholder="privacy key" bind:value={privKey.current} oninput={inputRefresh} />
					</div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									aria-invalid={sessCtx.session === null || !sessCtx.session.connected}
									class="ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring"
								>
									<span class="truncate"
										>{sessCtx.session && sessCtx.session.connected
											? sessCtx.session.session
											: 'Select Session'}</span
									>
									<ChevronDown class="ml-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
							{#if sessCtx.sessions && sessCtx.sessions.length > 0}
								{#each sessCtx.sessions as session}
									<DropdownMenu.Item
										onSelect={() => {
											if (!sessCtx.connection) return;
											sessCtx.session = new Session({ ...sessCtx.connection, session });
										}}
									>
										<span class="truncate">{session}</span>
									</DropdownMenu.Item>
								{/each}
								<DropdownMenu.Separator />
							{/if}
							<DropdownMenu.Item
								onclick={() => {
									createSessionOpen = true;
								}}
							>
								<span>New session</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Header>
	<Sidebar.Content class="gap-0">
		<Sidebar.Group>
			<Sidebar.GroupLabel
				class="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
			>
				Threads
				<!-- <ChevronRightIcon -->
				<!-- 	class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" -->
				<!-- /> -->
			</Sidebar.GroupLabel>

			<Dialog.Root>
				<Dialog.Trigger
					disabled={!conn?.appId ||
						!conn?.host ||
						!conn?.privKey ||
						!conn?.session ||
						!conn?.agentId}
				>
					{#snippet child({ props })}
						<Sidebar.GroupAction {...props} title="Create Thread">
							<Plus /> <span class="sr-only">Create Thread</span>
						</Sidebar.GroupAction>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>New Thread</Dialog.Title>
						<Dialog.Description>Create a new thread.</Dialog.Description>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Name</Label>
							<Input id="name" bind:value={threadName} class="col-span-3" autocomplete="name" />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Participants</Label>
							<Select.Root type="multiple" bind:value={participants}>
								<Select.Trigger class="w-[180px]"></Select.Trigger>
								<Select.Content>
									{#each Object.keys(conn?.agents ?? {}) as name}
										<Select.Item value={name}>{name}</Select.Item>
									{/each}
									{#if Object.values(conn?.agents ?? {}).length == 0}
										<p class="text-muted-foreground text-center text-sm">No agents registered.</p>
									{/if}
								</Select.Content>
							</Select.Root>
						</div>
					</div>

					<Dialog.Footer>
						<Button
							type="submit"
							onclick={() => {
								if (
									!conn?.appId ||
									!conn?.host ||
									!conn?.privKey ||
									!conn?.session ||
									!conn?.agentId
								)
									return;
								fetch(
									`http://${conn.host}/debug/${conn.appId}/${conn.privKey}/${conn.session}/${conn.agentId}/thread/`,
									{
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify({
											threadName,
											participantIds: participants ?? []
										})
									}
								);
							}}>Create</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each Object.values(conn?.threads ?? {}) as thread (thread.id)}
						{@const url = `/thread/${thread.id}`}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class="truncate" isActive={page.url.pathname === url}>
								{#snippet child({ props })}
									<a href={url} {...props}
										>{thread.name}
										<Badge class={cn(thread.unread == 0 && 'hidden')}>{thread.unread}</Badge>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel
				class="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
			>
				Agents
				<!-- <ChevronRightIcon -->
				<!-- 	class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" -->
				<!-- /> -->
			</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each Object.entries(conn?.agents ?? {}) as [name, agent] (name)}
						{@const url = `/agent/${name}`}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={page.url.pathname === url}>
								{#snippet child({ props })}
									<a href={url} {...props}
										><span class="w-full truncate">{name}</span>
										<!-- <Badge class={cn(thread.unread == 0 && 'hidden')}>{thread.unread}</Badge> -->
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel
				class="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
			>
				Tools
				<!-- <ChevronRightIcon -->
				<!-- 	class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" -->
				<!-- /> -->
			</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							class="truncate"
							isActive={page.url.pathname === '/tools/user-input'}
						>
							{#snippet child({ props })}
								{@const reqs = Object.values(tools.userInput.requests).filter(
									(req) => req.response === undefined
								).length}
								<a href="/tools/user-input" {...props}
									>User Input
									<Badge class={cn(reqs == 0 && 'hidden')}>{reqs}</Badge>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex justify-end">
				<Button onclick={toggleMode} variant="outline" size="icon">
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
