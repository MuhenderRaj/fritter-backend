import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import type {Hashtag} from '../hashtag/model';
import HashtagModel from '../hashtag/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freet Hashtags
 * stored in MongoDB, including adding, finding, updating, and deleting Hashtags on freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Hashtag> is the output of the HashtagModel() constructor,
 * and contains all the information in Hashtag. https://mongoosejs.com/docs/typescript.html
 */
class HashtagCollection {
  /**
   * Add a hashtag to the freet
   *
   * @param {string} freetId - The id of the freet
   * @param {string} hashtag - The name of the hashtag
   * @return {Promise<HydratedDocument<Hashtag>>} - The newly modified Hashtag
   * @throws {Error} - If hashtag is already found
   */
  static async addOne(freetId: Types.ObjectId | string, hashtag: string): Promise<HydratedDocument<Hashtag>> {
    let hashtagDoc = await HashtagModel.findOne({freet: freetId});

    if (!hashtagDoc) {
      hashtagDoc = await HashtagCollection.createOne(freetId);
    }

    const hashtagFound = hashtagDoc.hashtags.includes(hashtag);

    if (hashtagFound) {
      throw new Error('Hashtag already found');
    }

    hashtagDoc.hashtags.push(hashtag);

    await hashtagDoc.save();
    return hashtagDoc.populate('freet');
  }

  static async createOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Hashtag>> {
    const hashtagDoc = new HashtagModel({
      freet: freetId,
      hashtags: Array<string>()
    });
    await hashtagDoc.save(); // Saves freet to MongoDB
    return hashtagDoc.populate('freet');
  }

  /**
   * Delete a hashtag with given name.
   *
   * @param {string} freetId - The freetId of hashtag to delete
   * @return {Promise<Boolean>} - true if the hashtag has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string, hashtag: string): Promise<boolean> {
    const hashtagDoc = await HashtagModel.findOne({freetId});

    const hashtagFound = hashtagDoc.hashtags.includes(hashtag);

    if (!hashtagFound) {
      return false;
    }

    hashtagDoc.hashtags = hashtagDoc.hashtags.filter(presentHashtag => presentHashtag !== hashtag);

    await hashtagDoc.save();
    return true;
  }

  /**
   * Get the hashtags on a given freet
   *
   * @param {string} freetId - The freetId of freet to look at
   * @return {Promise<HydratedDocument<Hashtag>>} - the returned Hashtag object
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Hashtag>> {
    let hashtagDoc = await HashtagModel.findOne({freet: freetId});

    if (!hashtagDoc) {
      hashtagDoc = await HashtagCollection.createOne(freetId);
    }

    return hashtagDoc;
  }
}

export default HashtagCollection;
