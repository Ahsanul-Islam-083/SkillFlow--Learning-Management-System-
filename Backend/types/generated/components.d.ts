import type { Schema, Struct } from '@strapi/strapi';

export interface QuizElementsQuestion extends Struct.ComponentSchema {
  collectionName: 'components_quiz_elements_questions';
  info: {
    displayName: 'Question';
  };
  attributes: {
    correctAnswerIndex: Schema.Attribute.Integer & Schema.Attribute.Required;
    explanation: Schema.Attribute.Text;
    options: Schema.Attribute.JSON & Schema.Attribute.Required;
    questionText: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'quiz-elements.question': QuizElementsQuestion;
    }
  }
}
