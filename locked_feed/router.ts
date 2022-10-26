import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as feedValidator from '../locked_feed/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import LimitGroupsCollection from 'limit_groups/collection';
import ReactionsCollection from '../reaction/collection';

const router = express.Router();

/**
 * Get all the freets in the current user's feed
 *
 * @name GET /api/feed
 *
 * @return {FeedResponse} - The feed corresponding to the users
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    console.log('handler called');
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const feed = await FeedCollection.findOne(userId);
    res.status(200).json(util.constructFeedResponse(feed));
  }
);

/**
 * Unlock 5 new freets of the feed
 *
 * @name POST /api/feed/unlockFeed
 *
 * @return {FeedResponse} - The modified feed
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user has no post unlocks left
 */
router.post(
  '/unlockFeed',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const changedFeed = await FeedCollection.updateDecreaseUnlock(userId);
    if (!changedFeed) {
      res.status(404).json({
        message: 'You have no post unlocks left!'
      });
      return;
    }

    const feed = await FeedCollection.updateMany(userId, 5);

    res.status(201).json({
      message: 'Your feed was unlocked successfully.',
      feed: util.constructFeedResponse(feed)
    });
  }
);

/**
 * Get a new Feed
 *
 * @name GET /api/feed/newFeed
 *
 * @return {FeedResponse} - The new feed
 * @throws {403} - If the user is not logged in
 * @throws {401} - If it hasn't been a day
 */
router.get(
  '/newFeed',
  [
    userValidator.isUserLoggedIn,
    feedValidator.hasBeenADay
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await FeedCollection.deleteOne(userId);
    const newFeed = await FeedCollection.updateMany(userId, 20);

    res.status(201).json({
      message: 'Your feed was renewed successfully.',
      feed: util.constructFeedResponse(newFeed)
    });
  }
);

/**
 * Approve a post
 *
 * @name POST /api/feed/approvePost/:freetId
 *
 * @return {FeedResponse} - The new feed object
 * @throws {403} - If the user is not logged in, or can't modify freet
 * @throws {404} - If the freet is not found
 * @throws {401} - If the post can't be approved
 */
router.get(
  '/approvePost/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reactions = await ReactionsCollection.findOne(req.params.freetId);
    const {happy, sad, angry, laughing} = reactions;
    if (happy.length + laughing.length > 10 && (happy.length + laughing.length > sad.length + angry.length)) {
      const newFeed = await FeedCollection.updateIncreaseUnlock(userId);
      res.status(201).json({
        message: 'Your unlocks were increased successfully.',
        feed: util.constructFeedResponse(newFeed)
      });
    } else {
      res.status(401).send('Cannot approve post');
    }
  }
);

export {router as feedRouter};
