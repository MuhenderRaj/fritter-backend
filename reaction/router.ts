import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();
/**
 * Get reactions by freet.
 *
 * @name GET /api/reactions?freetId=id
 *
 * @return {ReactionResponse} - An object of reactions
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const allReactions = await ReactionCollection.findOne(req.query.freetId as string);
    const response = util.constructReactionResponse(allReactions);
    res.status(200).json(response);
  }
);

/**
 * Add a new reaction
 *
 * @name POST /api/reactions?freetId=id
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reaction = await ReactionCollection.addOne(userId, req.query.freetId as string, req.body.content);

    res.status(201).json({
      message: 'Your reaction was added successfully.',
      reactions: util.constructReactionResponse(reaction)
    });
  }
);

/**
 * Delete a reaction
 *
 * @name DELETE /api/reactions?freetId=id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    await ReactionCollection.deleteOne(req.query.freetId as string, userId);
    res.status(200).json({
      message: 'Your reaction was removed successfully.'
    });
  }
);

/**
 * Modify a reaction
 *
 * @name PUT /api/ractions?freetId=id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const reaction = await ReactionCollection.updateOne(req.query.freetId as string, userId, req.body.content);
    res.status(200).json({
      message: 'Your reaction was changed successfully.',
      reactions: util.constructReactionResponse(reaction)
    });
  }
);

export {router as reactionRouter};
