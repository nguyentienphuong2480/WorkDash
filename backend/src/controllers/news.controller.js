const path = require("path");
const service = require("../services/news.service");

exports.create = async (req, res) => {
  const { title, content, status } = req.body;

  const payload = {
    title,
    content,
    status
  };

  if (req.file) {
    // Lưu đường dẫn tĩnh để FE load được
    payload.image_url = `/uploads/${req.file.filename}`;
  }

  const data = await service.create(payload, req.user.id);
  res.status(201).json({ data });
};

exports.getAll = async (req, res) => {
  const data = await service.findAll();
  res.json({ data });
};

exports.update = async (req, res) => {
  const update = {
    title: req.body.title,
    content: req.body.content,
    status: req.body.status
  };

  if (req.file) {
    update.image_url = `/uploads/${req.file.filename}`;
  }

  await service.update(req.params.id, update);
  res.json({ message: "Updated" });
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Deleted" });
};
