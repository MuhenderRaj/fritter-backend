import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import HashtagCollection from './collection';
import * as userValidator from '../user/middleware';
import * as hashtagValidator from '../hashtag/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();
/**
 * Get hashtags by freet.
 *
 * @name GET /api/hashtags/:freetId
 *
 * @return {HashtagResponse} - An object of hashtags
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/:freetId',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const allHashtags = await HashtagCollection.findOne(req.params.freetId);
    const response = util.constructHashtagResponse(allHashtags);
    res.status(200).json(response);
  }
);

/**
 * Add a new hashtag
 *
 * @name POST /api/hashtags/:freetId
 *
 * @param {string} content - The content of the freet
 * @return {HashtagResponse} - Object with added hashtags
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is not the freet author
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 */
router.post(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    const hashtag = await HashtagCollection.addOne(req.params.freetId, req.body.hashtag);

    res.status(201).json({
      message: 'Your hashtag was added successfully.',
      hashtags: util.constructHashtagResponse(hashtag)
    });
  }
);

/**
 * Delete a hashtag
 *
 * @name DELETE /api/hashtags/:freetId/:hashtag
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in, is not the author of
 *                 the freet, or there is no such hashtag on freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId/:hashtag',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await HashtagCollection.deleteOne(req.params.freetId, req.params.hashtag);
    res.status(200).json({
      message: 'Your hashtag was removed successfully.'
    });
  }
);

export {router as hashtagRouter};
