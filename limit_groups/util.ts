import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {LimitGroups, PopulatedLimitGroups} from '../limit_groups/model';

// Update this if you add a property to the Feed type!
type LimitGroupsResponse = {
  _id: string;
  user: string;
  hashtag: string;
  viewed: number;
  maxViewable: number;
};

/**
 * Transform a raw LimitGroups object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<LimitGroups>} feed - A feed
 * @returns {LimitGroupsResponse} - The feed object formatted for the frontend
 */
const constructLimitGroupsResponse = (limitGroups: HydratedDocument<LimitGroups>): LimitGroupsResponse => {
  const limitGroupsCopy: PopulatedLimitGroups = {
    ...limitGroups.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = limitGroupsCopy.userId;
  delete limitGroupsCopy.userId;
  return {
    ...limitGroupsCopy,
    _id: limitGroupsCopy._id.toString(),
    user: username
  };
};

export {
  constructLimitGroupsResponse
};
