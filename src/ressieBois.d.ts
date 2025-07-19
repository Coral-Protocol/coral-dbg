/**
 * TypeScript declaration file for VisualizableResult and related types
 */

// Type alias for GaiaQuestionId
type GaiaQuestionId = string;

// Type alias for VerifiedExistingFile (simplified as string path in TypeScript)
type VerifiedExistingFile = string;

/**
 * Represents metadata provided by annotators
 */
interface AnnotatorMetadata {
  steps: string;
  numberOfSteps: string;
  howLongDidThisTake: string;
  tools: string;
  numberOfTools: string;
}

/**
 * Represents a question in the GAIA system
 */
interface GaiaQuestion {
  task_id: GaiaQuestionId;
  question: string;
  level: number;
  finalAnswer: string;
  fileName: string;
  annotatorMetadata: AnnotatorMetadata;
}

/**
 * Represents an answer attempt for a GAIA question
 */
interface GaiaAnswerAttempt {
  questionId: string;
  answer: string;
  sessionId: string;
  certaintyPercentage?: number;
  justification: string;
}

/**
 * Represents a message in a thread
 */
interface ResolvedMessage {
  id: string;
  threadName: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: number;
  mentions: string[];
}

/**
 * Represents a thread with participants
 */
interface ResolvedThread {
  id: string;
  name: string;
  creatorId: string;
  participants: string[];
  messages: ResolvedMessage[];
  isClosed: boolean;
  summary?: string;
}

/**
 * Represents the result of a GAIA question and answer attempt
 */
interface GaiaResult {
  question: GaiaQuestion;
  answerAttempt: GaiaAnswerAttempt;
  threads?: ResolvedThread[];
  isCorrect: boolean;
}

/**
 * Represents a visualizable result that wraps a GaiaResult
 * and provides additional metadata for visualization
 */
interface VisualizableResult {
  result: GaiaResult;
  characterCount: number;
}

export {
  GaiaQuestionId,
  VerifiedExistingFile,
  AnnotatorMetadata,
  GaiaQuestion,
  GaiaAnswerAttempt,
  ResolvedMessage,
  ResolvedThread,
  GaiaResult,
  VisualizableResult
};
