<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Input from '$lib/components/ui/input/input.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Resizable from '$lib/components/ui/resizable';
	import { useDebounce } from 'runed';
 import Message from '$lib/components/message.svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Users } from '@lucide/svelte';
	import { pickTextColor, stringToColor } from '$lib/color';
	import type { Message as MessageType, Thread } from '$lib/threads';

	// Props
	let {
		thread,
		messages,
		host,
		appId,
		privKey,
		session,
		agentId,
		class: className
	}: {
		thread: Thread & { unread: number };
		messages: MessageType[];
		host?: string;
		appId?: string;
		privKey?: string;
		session?: string;
		agentId?: string;
		class?: string;
	} = $props();


	let message = $state('');
	let memberListOpen = $state(true);
	let root = $state<HTMLElement | null>(null);
</script>

<div class={className}>
	<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
		<Separator orientation="vertical" class="mr-2 h-4" />
		<Breadcrumb.Root class="flex-grow">
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link>Threads</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{thread?.name ?? ''} {thread?.id ?? ''}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<Button
			variant="ghost"
			size="icon"
			onclick={() => {
				memberListOpen = !memberListOpen;
			}}
		>
			<Users />
		</Button>
	</header>
	{#if thread !== undefined && messages !== undefined}
		<Resizable.PaneGroup direction="horizontal">
			<Resizable.Pane class="flex h-full">
				<main class="flex flex-grow flex-col gap-0 p-4">
					<ScrollArea class="flex-grow" bind:ref={root}>
						<div class="flex flex-grow flex-col gap-0">
							{#each messages ?? [] as message, i (message.id)}
								<div
									class={cn(
										'border-t border-transparent py-1',
										i == (messages?.length ?? 0) - thread.unread && 'border-red-400'
									)}
								>
									<Message {message} />
								</div>
							{/each}
						</div>
					</ScrollArea>
					<footer class="flex flex-row">

					</footer>
				</main>
			</Resizable.Pane>
			{#if memberListOpen}
				<Resizable.Handle withHandle />
				<Resizable.Pane maxSize={60} minSize={5} defaultSize={20} class="flex flex-col gap-2 p-2">
					{#each thread.participants as member}
						{@const memberColor = stringToColor(member)}
						<div
							class={cn('truncate rounded-md border px-2 py-1', pickTextColor(memberColor))}
							style={`background-color: ${memberColor}; border-color: ${memberColor}55;`}
						>
							{member}
						</div>
					{/each}
				</Resizable.Pane>
			{/if}
		</Resizable.PaneGroup>
	{:else}
		<p class="text-muted-foreground mt-4 text-center text-sm">Thread not found.</p>
	{/if}
</div>
