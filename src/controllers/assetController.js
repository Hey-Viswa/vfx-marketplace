import prisma from '../config/db.js';

export const createAsset = async (req, res) => {
  try {
    const { title, price } = req.body;
    const file = req.file;


    if (!file || !title || !price) {
      return res.status(400).json({
        error: 'File not found',
      });
    }
    const newAsset = await prisma.asset.create({
      data: {
        title: title,
        price: parseFloat(price),
        fileUrl: file.path,
        sellerId: req.user.userId,
      },
    });
    res.status(201).json(newAsset);
    console.log('Body:', req.body);
    console.log('File:', req.file);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Failed to create asset!',
    });
  }
};

export const getAllAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        seller: {
          select: {
            id: true,
            email: true,
          },
        },
      },

    });
    res.status(200).json(assets);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Failed to get all assets',
    });
  }
};
