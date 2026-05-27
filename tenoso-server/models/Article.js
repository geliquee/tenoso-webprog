const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: [String], default: [] },
    paragraphs: { type: Number, default: 0 },
    preview: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Article || mongoose.model('Article', articleSchema);