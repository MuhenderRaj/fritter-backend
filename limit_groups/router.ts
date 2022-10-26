import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LimitGroupsCollection from './collection';
import * as userValidator from '../user/middleware';
import * as feedValidator from '../locked_feed/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the groups corresponding to the current user
 *
 * @name GET /api/groups
 *
 * @return {LimitGroupsResponse[]} - The feed corresponding to the users
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const limitGroups = await LimitGroupsCollection.findMany(userId);
    res.status(200).json({
      message: 'Groups were retrieved successfully',
      limitGroups: limitGroups.map(util.constructLimitGroupsResponse)
    });
  }
);

/**
 * Remove all hashtags from ever having been seen by the user, but only after a day
 *
 * @name DELETE /api/groups
 *
 * @throws {403} - If the user is not logged in
 * @throws {401} - If it hasn't been a day since the last feed
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.hasBeenADay
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await LimitGroupsCollection.deleteMany(userId);

    res.status(201).json('the groups have been cleared successfully');
  }
);

export {router as limitGroupsRouter};
