import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import {isUserLoggedIn} from 'user/middleware';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for LimitGroups on the backend
export type LimitGroups = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  hashtag: string;
  maxViewable: number; // Infinity if hashtag is non-essential
  viewed: number;
};

export type ViewedFreets = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedLimitGroups = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  hashtag: string;
  maxViewable: number;
  viewed: number;
};

export type PopulatedViewedFreets = {
  _id: Types.ObjectId;
  userId: User;
  freetId: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Limit groups stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LimitGroupsSchema = new Schema<LimitGroups>({
  // The userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The hashtag
  hashtag: {
    type: String,
    required: true
  },
  // The maximum posts per feed of that hashtag
  maxViewable: {
    type: Number,
    required: true
  },
  viewed: {
    type: Number,
    required: true
  }
});

const ViewedFreetsSchema = new Schema<ViewedFreets>({
  // The userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const LimitGroupsModel = model<LimitGroups>('LimitGroups', LimitGroupsSchema);
const ViewedFreetsModel = model<ViewedFreets>('ViewedFreets', ViewedFreetsSchema);
export {
  LimitGroupsModel,
  ViewedFreetsModel
};
