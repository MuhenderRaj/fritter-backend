import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Hashtag, PopulatedHashtag} from '../hashtag/model';
import type {Freet} from '../freet/model';

// Update this if you add a property to the Hashtag type!
type HashtagResponse = {
  _id: string;
  freet: string;
  hashtags: string[];
};

/**
 * Transform a raw Hashtag object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Hashtag>} hashtag - A set of hashtags for a freet
 * @returns {HashtagResponse} - The hashtag object formatted for the frontend
 */
const constructHashtagResponse = (hashtag: HydratedDocument<Hashtag>): HashtagResponse => {
  const hashtagCopy: PopulatedHashtag = {
    ...hashtag.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const freetId = hashtagCopy.freet;
  delete hashtagCopy.freet;
  return {
    ...hashtagCopy,
    _id: hashtagCopy._id.toString(),
    freet: freetId._id.toString()
  };
};

export {
  constructHashtagResponse
};
