import { Typegoose } from 'typegoose';

export class Example extends Typegoose {
  _id?: string;

  name?: string;

  description?: string;
}

export const ExampleModel = new Example().getModelForClass(Example, {
  schemaOptions: { timestamps: true },
});
