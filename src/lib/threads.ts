/**
 * Type definitions for thread and message data structures used in the GAIA benchmark report
 */

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
