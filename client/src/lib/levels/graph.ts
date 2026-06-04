import { LevelStage } from '../../types/game';

export const graphLevelData: LevelStage[] = [
  {
    id: 'graph-intro',
    type: 'intro',
    title: 'Understanding Graphs',
    content: 'A Graph is a non-linear data structure consisting of Nodes (vertices) connected by Edges. Unlike Trees, Graphs can have cycles and multiple paths between nodes.',
    visualType: 'graph',
  },
  {
    id: 'graph-puzzle-bfs',
    type: 'graph',
    instruction: 'Breadth-First Search: Visit all neighbors of A before moving deeper.',
    initialState: [
      { id: 'A', value: 'A', x: 15, y: 45, neighbors: ['C', 'D', 'E'] },
      { id: 'C', value: 'C', x: 45, y: 30, neighbors: ['A', 'B', 'F', 'E', 'G'] },
      { id: 'D', value: 'D', x: 5,  y: 85, neighbors: ['A'] },
      { id: 'E', value: 'E', x: 25, y: 85, neighbors: ['A', 'C'] },
      { id: 'B', value: 'B', x: 70, y: 45, neighbors: ['C', 'F'] },
      { id: 'F', value: 'F', x: 90, y: 15, neighbors: ['C', 'B', 'G'] },
      { id: 'G', value: 'G', x: 80, y: 85, neighbors: ['C', 'F'] },
    ] ,
    targetState: ['A', 'C', 'D', 'E', 'B', 'F', 'G'],
  },
  {
    id: 'graph-quiz-1',
    type: 'quiz',
    question: 'Which data structure is typically used to implement Breadth-First Search (BFS)?',
    options: ['Stack', 'Queue', 'Array', 'Linked List'],
    correctAnswer: 'Queue',
  },
  {
    id: 'graph-summary',
    type: 'summary',
    xpReward: 150,
  },
];