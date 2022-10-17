import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reaction, PopulatedReaction} from '../reaction/model';
import type {Freet} from '../freet/model';

// Update this if you add a property to the Freet type!
type ReactionResponse = {
  _id: string;
  freet: string;
  happy: number;
  sad: number;
  angry: number;
  laughing: number;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reaction>} reaction - A reaction
 * @returns {ReactionResponse} - The reaction object formatted for the frontend
 */
const constructReactionResponse = (reaction: HydratedDocument<Reaction>): ReactionResponse => {
  const reactionCopy: PopulatedReaction = {
    ...reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const happyCount = reactionCopy.happy.length;
  const sadCount = reactionCopy.sad.length;
  const angryCount = reactionCopy.angry.length;
  const laughingCount = reactionCopy.laughing.length;
  const freetId = reactionCopy.freet._id.toString();
  delete reactionCopy.happy;
  delete reactionCopy.sad;
  delete reactionCopy.angry;
  delete reactionCopy.laughing;
  delete reactionCopy.freet;
  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    freet: freetId,
    happy: happyCount,
    sad: sadCount,
    angry: angryCount,
    laughing: laughingCount
  };
};

export {
  constructReactionResponse
};
