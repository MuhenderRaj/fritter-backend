import type {HydratedDocument, Types} from 'mongoose';
import type {Feed} from './model';
import FeedModel from './model';
import UserCollection from '../user/collection';
import LimitGroupsCollection from '../limit_groups/collection';
import type {Freet} from '../freet/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Feed> is the output of the FeedModel() constructor,
 * and contains all the information in Feed. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
  /**
   * Create a new feed, possibly overwriting a previous one
   *
   * @param {string} userId - The id of the user of the feed
   * @return {Promise<HydratedDocument<Feed>>} - The newly created feed
   */
  static async createOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    const date = new Date();
    const feed = new FeedModel({
      userId,
      dateOfFeed: date,
      freets: new Array<Types.ObjectId>(),
      postUnlocks: 2
    });
    await feed.save(); // Saves feed to MongoDB
    return feed.populate('userId', 'freets');
  }

  /**
   * Gets a feed by userId, or creates one if not present
   *
   * @param {string} userId - The id of the user whose feed to find
   * @return {Promise<HydratedDocument<Feed>> | Promise<null> } - The feed for the given userId, if any
   */
  static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    let feed = await FeedModel.findOne({userId});
    if (!feed) {
      await FeedCollection.createOne(userId);
      feed = await FeedCollection.updateMany(userId, 20);
    }

    return feed.populate('userId', 'freets');
  }

  /**
   * Add to a feed a new freet
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @param {string} freetId - The new freet to be added to the feed
   * @return {Promise<HydratedDocument<Feed>>} - The newly updated feed
   */
  static async updateOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    const feed = await FeedModel.findOne({userId});
    feed.freets.push(freetId as Types.ObjectId);
    feed.dateOfFeed = new Date();
    await feed.save();
    return feed.populate('userId', 'freets');
  }

  /**
   * Add to a feed new freets
   *
   * @param {string} content - The new content of the freet
   * @param {number} numFreets - The number of freets to be added
   * @return {Promise<HydratedDocument<Feed>>} - The newly updated feed
   */
  static async updateMany(userId: Types.ObjectId | string, numFreets: number): Promise<HydratedDocument<Feed>> {
    const feed = await FeedModel.findOne({userId});

    const freets: Array<HydratedDocument<Freet>> = await LimitGroupsCollection.getFreets(userId, numFreets);

    for (const freet of freets) {
      feed.freets.push(freet._id);
    }

    feed.dateOfFeed = new Date();
    await feed.save();
    return feed.populate('userId', 'freets');
  }

  /**
   * Add one to number of post unlocks
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @return {Promise<HydratedDocument<Feed>>} - The newly updated feed
   */
  static async updateIncreaseUnlock(userId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    const feed = await FeedModel.findOne({userId});
    feed.postUnlocks++;
    await feed.save();
    return feed.populate('userId', 'freets');
  }

  /**
   * Remove one from number of post unlocks.
   *
   * @param {string} userId - The id of the user whose feed is to be updated
   * @return {Promise<HydratedDocument<Feed>> | Promise<null>} - The newly updated feed, or null if postUnlocks was 0
   */
  static async updateDecreaseUnlock(userId: Types.ObjectId | string): Promise<HydratedDocument<Feed>> {
    let feed = await FeedModel.findOne({userId});
    if (!feed) {
      feed = await FeedCollection.createOne(userId);
      feed = await FeedCollection.updateMany(userId, 20);
    }

    if (feed.postUnlocks === 0) {
      return null;
    }

    feed.postUnlocks--;

    await feed.save();
    return feed.populate('userId', 'freets');
  }

  /**
   * Create the feed document of a user
   *
   * @param {string} userId - The id of the user whose feed is to be deleted
   * @return {Promise<boolean>} - Whether operation was successful
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const feed = await FeedModel.findOne({userId});
    feed.freets = [];
    feed.dateOfFeed = new Date();
    await feed.save();
    return true;
  }
}

export default FeedCollection;
