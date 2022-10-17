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
  freetId: Types.ObjectId;
  happy: Types.Array<Types.ObjectId>;
  sad: Types.Array<Types.ObjectId>;
  angry: Types.Array<Types.ObjectId>;
  laughing: Types.Array<Types.ObjectId>;
};

export type PopulatedReaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  happy: User[];
  sad: User[];
  angry: User[];
  laughing: User[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReactionSchema = new Schema<Reaction>({
  // The id of the freet
  freetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  happy: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  sad: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  angry: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  laughing: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
