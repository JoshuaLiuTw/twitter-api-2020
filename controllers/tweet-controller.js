const { Tweet, Reply } = require('../models')
const helpers = require('../_helpers')


const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req)?.id
    if (description.length > 140 || description.length < 1) return res.status(400).json({ status: "error", message: "Content should be less than 140 characters and not empty" })
    try {
      const tweet = await Tweet.create({
        description,
        UserId
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully post the tweet',
        data: {
          tweet
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']] })
      if (!tweets) return res.status(404).json({ status: "error", message: "Not found" })
      const shortenedTweets = tweets.map(tweet => {
        const shortenedDescription = tweet.description.length > 50 ? tweet.description.slice(0, 50) + '...' : tweet.description;
        return {
          ...tweet,
          description: shortenedDescription
        };
      })
      return res.status(200).json(shortenedTweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const id = req.params.tweet_id
    try {
      const tweet = await Tweet.findOne({ id })
      if (!tweet) return res.status(404).json({ status: "error", message: "Not found" })
      return res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  getReply: async (req, res, next) => {
    const TweetId = req.params.tweet_id
    try {
      const replies = await Reply.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']], where: { TweetId } })
      if (!replies) return res.status(404).json({ status: "error", message: "Not found" })
      const shortenedReplies = replies.map(reply => {
        const shortenedComment = reply.comment.length > 50 ? reply.comment.slice(0, 50) + '...' : reply.comment;
        return {
          ...reply,
          comment: shortenedComment
        }
      })
      return res.status(200).json(shortenedReplies)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    const { comment } = req.body
    if (comment.length < 1 || comment.length > 140) return res.status(400).json({ status: 'error', message: 'Comment should be less than 140 characters and not empty' })
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweet_id
    try {
      const reply = await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.status(200).json(reply)
    } catch (err) {
      next(err)
    }
  },
}

module.exports = tweetController