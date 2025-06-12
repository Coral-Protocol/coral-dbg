<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { socketCtx } from '$lib/threads';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { ChevronDown, Plus, PlusIcon } from '@lucide/svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { useId } from 'bits-ui';

	let { open = $bindable(false), agents }: { open: boolean; agents: string[] } = $props();

	let agentPickerOpen = $state(false);
	let graph: { agents: string[] } = $state({
		agents: []
	});

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const triggerId = useId();
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>New Session</Dialog.Title>
			<Dialog.Description>Create a new session.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Agents</Label>

				<Popover.Root bind:open={agentPickerOpen}>
					<Popover.Trigger
						id={triggerId}
						class={buttonVariants({
							variant: 'outline',
							size: 'icon',
							class: 'justify-center'
						})}
					>
						<PlusIcon />
					</Popover.Trigger>
					<Popover.Content class="w-[200px] p-0" side="right" align="start">
						<Command.Root>
							<Command.Input placeholder="Add agent..." />
							<Command.List>
								<Command.Empty>No results found.</Command.Empty>
								<Command.Group>
									{#each agents as agent}
										<Command.Item
											value={agent}
											onSelect={() => {
												graph.agents.push(agent);
												closeAndFocusTrigger(triggerId);
											}}
										>
											<span>
												{agent}
											</span>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>

		<Dialog.Footer>
			<Button type="submit" onclick={() => {}}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
