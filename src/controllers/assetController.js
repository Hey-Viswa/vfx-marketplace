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

export const updateAsset = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, price } = req.body;

    const findAsset = await prisma.asset.findUnique({
      where: {
        id: id,
      },
    });
    if (!findAsset) {
      return res.status(404).json({
        error: 'No such asset found.',
      });
    }

    // Compare the sellerId from the database with the logged-in user's ID
    if (findAsset.sellerId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to edit this asset' });
    }

    const updateAsset = await prisma.asset.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        price: parseFloat(price),
      },
    });
    return res.status(200).json(updateAsset);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to update asset!' });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId } = req.user;

    const deleteAsset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!deleteAsset) {
      return res.status(404).json({
        message: 'No such asset found.',
      });
    }
    if (deleteAsset.sellerId !== userId) {
      return res.status(403).json({
        message: 'cannot delete asset',
      });
    }
    const softDelete = await prisma.asset.update({
      where: { id: id },
      data: {
        isActive: false,
      },
    });
    return res.status(200).json({
      message: 'Asset Successfully deleted!',
      softDelete,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update asset!' });
  }
};
