import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import type {Reaction} from '../reaction/model';
import ReactionModel from '../reaction/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freet reactions
 * stored in MongoDB, including adding, finding, updating, and deleting reactions on freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reaction> is the output of the ReactionModel() constructor,
 * and contains all the information in Reaction. https://mongoosejs.com/docs/typescript.html
 */
class ReactionCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} reacterId - The id of the reacter of the freet
   * @param {string} freetId - The id of the freet
   * @param {string} reactionType - The name of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly modified reaction
   * @throws {Error} - If user has already reacted or reactionType is not valid
   */
  static async addOne(reacterId: Types.ObjectId | string, freetId: Types.ObjectId | string, reactionType: string): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({freetId}) ?? await ReactionCollection.createOne(freetId);

    const happyFound = reaction.happy.some(user => user === reacterId);
    const sadFound = reaction.sad.some(user => user === reacterId);
    const angryFound = reaction.angry.some(user => user === reacterId);
    const laughingFound = reaction.laughing.some(user => user === reacterId);

    if (happyFound || sadFound || angryFound || laughingFound) {
      throw new Error('Reaction already found');
    }

    if (reactionType === 'happy') {
      reaction.happy.push(reacterId);
    } else if (reactionType === 'sad') {
      reaction.sad.push(reacterId);
    } else if (reactionType === 'angry') {
      reaction.angry.push(reacterId);
    } else if (reactionType === 'laughing') {
      reaction.laughing.push(reacterId);
    } else {
      throw new Error('reactionType is not valid');
    }

    await reaction.save();
    return reaction.populate('freetId');
  }

  static async createOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    const reaction = new ReactionModel({
      freetId,
      happy: [],
      sad: [],
      angry: [],
      laughing: []
    });
    await reaction.save(); // Saves freet to MongoDB
    return reaction.populate('freetId');
  }

  /**
   * Update a freet with the new reaction
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, reacterId: Types.ObjectId | string, reactionType: string): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({freetId});

    const happyFound = reaction.happy.some(user => user === reacterId);
    const sadFound = reaction.sad.some(user => user === reacterId);
    const angryFound = reaction.angry.some(user => user === reacterId);
    const laughingFound = reaction.laughing.some(user => user === reacterId);

    if (happyFound) {
      reaction.happy.pull(reacterId);
    } else if (sadFound) {
      reaction.sad.pull(reacterId);
    } else if (angryFound) {
      reaction.angry.pull(reacterId);
    } else if (laughingFound) {
      reaction.laughing.pull(reacterId);
    } else {
      throw new Error('user hasn\'t reacted to this post');
    }

    if (reactionType === 'happy') {
      reaction.happy.push(reacterId);
    } else if (reactionType === 'sad') {
      reaction.sad.push(reacterId);
    } else if (reactionType === 'angry') {
      reaction.angry.push(reacterId);
    } else if (reactionType === 'laughing') {
      reaction.laughing.push(reacterId);
    } else {
      throw new Error('reactionType is not valid');
    }

    await reaction.save();
    return reaction.populate('freetId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string, reacterId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionModel.findOne({freetId});

    const happyFound = reaction.happy.some(user => user === reacterId);
    const sadFound = reaction.sad.some(user => user === reacterId);
    const angryFound = reaction.angry.some(user => user === reacterId);
    const laughingFound = reaction.laughing.some(user => user === reacterId);

    if (happyFound) {
      reaction.happy.pull(reacterId);
    } else if (sadFound) {
      reaction.sad.pull(reacterId);
    } else if (angryFound) {
      reaction.angry.pull(reacterId);
    } else if (laughingFound) {
      reaction.laughing.pull(reacterId);
    } else {
      return false;
    }

    await reaction.save();
    return true;
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({freetId}) ?? await ReactionCollection.createOne(freetId);
    return reaction.populate('freetId');
  }
}

export default ReactionCollection;
