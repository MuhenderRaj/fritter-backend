import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Feed, PopulatedFeed} from '../locked_feed/model';
import type {Freet, PopulatedFreet} from '../freet/model';

// Update this if you add a property to the Feed type!
type FeedResponse = {
  _id: string;
  user: string;
  dateOfFeed: string;
  freets: Freet[];
  postUnlocks: number;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Feed>} feed - A feed
 * @returns {FeedResponse} - The feed object formatted for the frontend
 */
const constructFeedResponse = (feed: HydratedDocument<Feed>): FeedResponse => {
  const feedCopy: PopulatedFeed = {
    ...feed.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = feedCopy.userId;
  const date = feedCopy.dateOfFeed;
  delete feedCopy.userId;
  delete feedCopy.dateOfFeed;
  return {
    ...feedCopy,
    _id: feedCopy._id.toString(),
    user: username,
    dateOfFeed: formatDate(date)
  };
};

export {
  constructFeedResponse
};
