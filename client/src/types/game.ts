// 1. Primitive data for simple puzzles
export type Primitive = string | number;

// 2. Graph node
export interface GraphNode {
  id: string;
  value: Primitive;

  x?: number;
  y?: number;

  next?: string | null;
  left?: string | null;
  right?: string | null;
  neighbors?: string[];
}

// 3. Graph edge
export interface GraphEdge {
  from: string;
  to: string;
}

// 4. Intro Stage
export interface IntroStage {
  id: string;
  type: 'intro';
  title: string;
  content: string;
  visualType?: 'locker-row' | 'graph' | 'tree' | 'sequential-scan' | 'stack-visual';
}

// 5. Puzzle Stage (non-graph logic only)
export interface PuzzleStage {
  id: string;
  type: 'puzzle' | 'sorting-puzzle' | 'algorithm-puzzle' | 'stack' | 'queue' | 'tree';
  instruction: string;
  initialState: (Primitive | GraphNode)[];
  targetState?: (Primitive | GraphNode)[];
  targetValue?: Primitive;
  correctAnswer?: Primitive;
  hint?: string;
  onComplete?: () => void;
}

// 6. GRAPH STAGE (THIS IS THE FIX)
export interface GraphStage {
  id: string;
  type: 'graph';
  instruction: string;
  initialState: GraphNode[];
  targetState: string[];
  edges?: GraphEdge[];
}

// 7. Quiz Stage
export interface QuizStage {
  id: string;
  type: 'quiz';
  question: string;
  options: string[];
  correctAnswer: string;
}

// 8. Summary Stage
export interface SummaryStage {
  id: string;
  type: 'summary';
  xpReward: number;
}

// 9. MASTER UNION
export type LevelStage =
  | IntroStage
  | PuzzleStage
  | QuizStage
  | SummaryStage
  | GraphStage;