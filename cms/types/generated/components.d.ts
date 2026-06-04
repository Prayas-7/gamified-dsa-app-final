import type { Schema, Struct } from '@strapi/strapi';

export interface StagesIntroStage extends Struct.ComponentSchema {
  collectionName: 'components_stages_intro_stages';
  info: {
    displayName: 'IntroStage';
    icon: 'bulletList';
  };
  attributes: {
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    visualType: Schema.Attribute.Enumeration<
      ['locker-row', 'graph', 'tree', 'sequential-scan']
    >;
  };
}

export interface StagesPuzzleStage extends Struct.ComponentSchema {
  collectionName: 'components_stages_puzzle_stages';
  info: {
    displayName: 'PuzzleStage';
    icon: 'manyToOne';
  };
  attributes: {
    hint: Schema.Attribute.Text;
    initialState: Schema.Attribute.JSON;
    instruction: Schema.Attribute.String;
    targetState: Schema.Attribute.JSON;
    targetValue: Schema.Attribute.Integer;
    type: Schema.Attribute.Enumeration<
      ['puzzle', 'sorting-puzzle', 'algorithm-puzzle']
    >;
  };
}

export interface StagesQuizStage extends Struct.ComponentSchema {
  collectionName: 'components_stages_quiz_stages';
  info: {
    displayName: 'QuizStage';
    icon: 'manyToMany';
  };
  attributes: {
    correctAnswer: Schema.Attribute.String;
    options: Schema.Attribute.JSON;
    question: Schema.Attribute.Text;
    type: Schema.Attribute.Enumeration<['quiz']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'stages.intro-stage': StagesIntroStage;
      'stages.puzzle-stage': StagesPuzzleStage;
      'stages.quiz-stage': StagesQuizStage;
    }
  }
}
