<script lang="ts">
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { sessionCtx } from '$lib/threads';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight, ExternalLink } from '@lucide/svelte';

	let ctx = sessionCtx.get();
	let conn = $derived(ctx.session);

	let threads = $derived(conn?.threads ?? {});
	let agents = $derived(conn?.agents ?? {});

	let agentName = $derived(page.params['agent']);
	let agent = $derived(agents[agentName]);

	let memberThreads = $derived(
		Object.values(threads).filter((thread) => thread.participants.indexOf(agentName) !== -1)
	);
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root class="flex-grow">
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link>Agents</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{page.params['agent'] ?? ''} {agent?.agentType ?? ''}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		{#if agent !== undefined}
			<main class="p-4">
				<h1 class="text-3xl font-bold">{agentName}</h1>
				<!-- <p>{agent.description}</p> -->
				<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="threads">
					<Accordion.Item value="threads">
						<Accordion.Trigger>Threads</Accordion.Trigger>
						<Accordion.Content class="flex flex-col gap-4 text-balance">
							<ul class="pl-4">
								{#if memberThreads.length === 0}
									<li class="text-muted-foreground text-sm">Not a member of any threads.</li>
								{/if}
								{#each memberThreads as thread}
									<li class="flex items-center">
										<ChevronRight class="size-4" />
										<Button variant="link" href={`/thread/${thread.id}`} class="font-bold">
											{thread.name}<ExternalLink class="size-3" />
										</Button>
										<span>
											with:
											{#each thread.participants as part}
												{#if part !== agentName}
													<Button variant="link" href={`/agent/${part}`} class="m-0 px-2"
														>{part}</Button
													>
												{/if}
											{/each}
										</span>
									</li>
								{/each}
							</ul>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</main>
		{:else}
			<p class="text-muted-foreground mt-4 text-center text-sm">Agent not found.</p>
		{/if}
	</Sidebar.Inset>
</Sidebar.Provider>
