import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Hashtag
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Hashtag on the backend
export type Hashtag = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Types.ObjectId;
  hashtags: string[];
};

export type PopulatedHashtag = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  hashtags: string[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const HashtagSchema = new Schema<Hashtag>({
  // The freet
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  hashtags: {
    type: [String],
    required: true
  }
});

const HashtagModel = model<Hashtag>('Hashtag', HashtagSchema);
export default HashtagModel;
