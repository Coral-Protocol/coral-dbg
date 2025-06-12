import { Context } from 'runed';
import type { Session } from './session.svelte';
export type Message = {
	id: string;
	threadId: string;
	senderId: string;
	content: string;
	timestamp: number;
	mentions: string[];
};

export type Thread = {
	id: string;
	name: string;
	creatorId: string;
	summary?: string;
	participants: string[];
	isClosed: boolean;
};

export type AgentOption = {
	name: string;
	description?: string;
} & ({ type: 'string'; default: string | null } | { type: 'number'; default: number | null });

export type Agent = {
	id: string;
	options: { [name: string]: AgentOption };
};

export const socketCtx = new Context<{
	session: Session | null;
	registry: { [id: string]: Agent } | null;
	sessions: string[] | null;
}>('websocket');
