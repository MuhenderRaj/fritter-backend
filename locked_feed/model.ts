import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Feed = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  dateOfFeed: Date;
  freets: Types.ObjectId[];
  postUnlocks: number;
};

export type PopulatedFeed = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  dateOfFeed: Date;
  freets: Freet[];
  postUnlocks: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Feed freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FeedSchema = new Schema<Feed>({
  // The author userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the feed was created
  dateOfFeed: {
    type: Date,
    required: true
  },
  // The freets of the feed
  freets: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Freet'
  },
  postUnlocks: {
    type: Number,
    required: true
  }
});

const FeedModel = model<Feed>('Feed', FeedSchema);
export default FeedModel;
