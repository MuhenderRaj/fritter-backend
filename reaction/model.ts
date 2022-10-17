import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Reaction
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reaction on the backend
export type Reaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Types.ObjectId;
  happy: Types.Array<string>;
  sad: Types.Array<string>;
  angry: Types.Array<string>;
  laughing: Types.Array<string>;
};

export type PopulatedReaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  happy: string[];
  sad: string[];
  angry: string[];
  laughing: string[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReactionSchema = new Schema<Reaction>({
  // The freet
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  happy: {
    type: [String],
    required: true
  },
  sad: {
    type: [String],
    required: true
  },
  angry: {
    type: [String],
    required: true
  },
  laughing: {
    type: [String],
    required: true
  }
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
