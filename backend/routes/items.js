const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/items — Add item (protected)
router.post("/api/items", authMiddleware, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;
  try {
    const item = new Item({
      userId: req.user.userId,
      itemName, description, type, location, date, contactInfo,
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/items — Get all items (protected)
router.get("/api/items", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/items/search?name=xyz — Search items (protected)
router.get("/api/items/search", authMiddleware, async (req, res) => {
  const { name } = req.query;
  try {
    const items = await Item.find({
      itemName: { $regex: name, $options: "i" },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/items/:id — Get item by ID (protected)
router.get("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/items/:id — Update item (protected)
router.put("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    if (item.userId.toString() !== req.user.userId)
      return res.status(401).json({ msg: "Not authorized" });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/items/:id — Delete item (protected)
router.delete("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    if (item.userId.toString() !== req.user.userId)
      return res.status(401).json({ msg: "Not authorized" });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ msg: "Item deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;