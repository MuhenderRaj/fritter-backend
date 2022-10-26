import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FeedCollection from '../locked_feed/collection';

const hasBeenADay = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session.userId as string) ?? '';
  const feed = await FeedCollection.findOne(userId);
  if ((Date.now() - feed.dateOfFeed.getTime()) < 86400 * 1000) {
    res.status(401).json({
      error: {
        notBeenADay: 'Wait until a day to perform this operation'
      }
    });
    return;
  }

  next();
};

export {
  hasBeenADay
};
