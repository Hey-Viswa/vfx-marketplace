import prisma from '../config/db.js';

export const createReview = async (req, res) => {
  const { assetId, rating, comment } = req.body;
  const userid = req.user.userId;

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }
    const newReview = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || '',
        userId: parseInt(userid),
        assetId: parseInt(assetId),
      },
    });
    res
      .status(201)
      .json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAssetReviews = async (req, res) => {
  const { assetId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { assetId: parseInt(assetId) },
    });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching asset reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
