import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import type {LimitGroups} from '../limit_groups/model';
import {LimitGroupsModel, ViewedFreetsModel} from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import HashtagCollection from '../hashtag/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<LimitGroups> is the output of the LimitGroupsModel() constructor,
 * and contains all the information in LimitGroups. https://mongoosejs.com/docs/typescript.html
 */
class LimitGroupsCollection {
  /**
   * Create a new group limit, possibly overwriting a previous one
   *
   * @param {string} userId - The id of the user of the feed
   * @return {Promise<HydratedDocument<LimitGroups>>} - The newly created feed
   */
  static async addOne(userId: Types.ObjectId | string, hashtag: string, maxViewable = 5): Promise<HydratedDocument<LimitGroups>> {
    const limitGroup = new LimitGroupsModel({
      userId,
      hashtag,
      maxViewable,
      viewed: 0
    });
    await limitGroup.save(); // Saves feed to MongoDB
    return limitGroup.populate('userId');
  }

  /**
   * Gets a group limit object with the given hashtag for the given user, or create one
   *
   * @param {string} userId - The id of the user whose feed to find
   * @return {Promise<HydratedDocument<LimitGroups>> | Promise<null> } - The feed for the given userId, if any
   */
  static async findOne(userId: Types.ObjectId | string, hashtag: string): Promise<HydratedDocument<LimitGroups>> {
    const allGroups = await LimitGroupsCollection.findMany(userId);
    const group = allGroups.filter(group => group.hashtag === hashtag);

    if (!group[0]) {
      console.log(hashtag);
      group[0] = await LimitGroupsCollection.addOne(userId, hashtag);
    }

    return group[0];
  }

  /**
   * Gets all group limit objects for the given user
   *
   * @param {string} userId - The id of the user whose groups to find
   * @return {Array<Promise<HydratedDocument<LimitGroups>>>} - The feed for the given userId, if any
   */
  static async findMany(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<LimitGroups>>> {
    return LimitGroupsModel.find({userId}).populate('userId');
  }

  /**
   * Increase the viewed count of a grouping
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @param {string} freetId - The new freet to be added to the feed
   * @return {Promise<HydratedDocument<LimitGroups>>} - The newly updated feed
   */
  static async updateOne(userId: Types.ObjectId | string, hashtag: string): Promise<HydratedDocument<LimitGroups>> {
    const limitGroup = await LimitGroupsCollection.findOne(userId, hashtag);

    limitGroup.viewed += 1;
    limitGroup.isNew = false;

    await limitGroup.save();
    return limitGroup.populate('userId');
  }

  /**
   * Whether the viewed count of a grouping can be increased
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @param {string} freetId - The new freet to be added to the feed
   * @return {Promise<HydratedDocument<LimitGroups>>} - The newly updated feed
   */
  static async canUpdateOne(userId: Types.ObjectId | string, hashtag: string): Promise<boolean> {
    const limitGroup = await LimitGroupsCollection.findOne(userId, hashtag);

    return limitGroup.viewed + 1 <= limitGroup.maxViewable;
  }

  /**
   * Whether the freet can be viewed
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @param {string} freetId - The new freet to be added to the feed
   * @return {Promise<HydratedDocument<LimitGroups>>} - The newly updated feed
   */
  static async canViewFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    if (await ViewedFreetsModel.findOne({userId, freetId})) { // Already seen
      return false;
    }

    const hashtagDoc = await HashtagCollection.findOne(freetId);
    const {hashtags} = hashtagDoc;
    const promises = hashtags.map(async hashtag => LimitGroupsCollection.canUpdateOne(userId, hashtag));

    return (await Promise.all(promises)).every(promiseReturn => promiseReturn);
  }

  /**
   * View the freet
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @param {string} freetId - The new freet to be added to the feed
   * @return {Promise<HydratedDocument<LimitGroups>>} - The newly updated feed
   */
  static async viewFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<void> {
    const hashtagDoc = await HashtagCollection.findOne(freetId);
    const {hashtags} = hashtagDoc;
    const promises = hashtags.map(async hashtag => LimitGroupsCollection.updateOne(userId, hashtag));
    const doc = await ViewedFreetsModel.create({
      userId,
      freetId
    });
    await doc.save();
    await Promise.all(promises);
  }

  /**
   * Delete the limit group document of a user
   *
   * @param {string} userId - The id of the user whose feed is to be deleted
   * @return {Promise<boolean>} - Whether operation was successful
   */
  static async deleteOne(userId: Types.ObjectId | string, hashtag: string): Promise<boolean> {
    const limit = await LimitGroupsModel.findOne({userId, hashtag});
    limit.viewed = 0;
    await limit.save();
    return true;
  }

  /**
   * Delete all the limit group documents of a user
   *
   * @param {string} userId - The id of the user whose feed is to be deleted
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<boolean> {
    const limits = await LimitGroupsModel.find({userId});
    for (const limit of limits) {
      limit.viewed = 0;
    }

    await Promise.all(limits.map(async limit => limit.save()));
    return true;
  }

  /**
   * Get freets satisfying groupings
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @return {Promise<HydratedDocument<Freet>>[]} - The newly updated feed
   */
  static async getFreets(userId: Types.ObjectId | string, numFreets: number): Promise<Array<HydratedDocument<Freet>>> {
    const freets = await FreetCollection.findAll();

    const viewableFreets = (await Promise.all(freets.map(async freet => {
      if (await LimitGroupsCollection.canViewFreet(userId, freet._id)) {
        await LimitGroupsCollection.viewFreet(userId, freet._id);
        return freet;
      }

      return null;
    }))).filter(freet => !(freet === null));

    const returnedFreets = viewableFreets.slice(0, numFreets);

    return Promise.all(returnedFreets);
  }
}

export default LimitGroupsCollection;
