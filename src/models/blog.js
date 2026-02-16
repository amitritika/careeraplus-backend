const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, trim: true, minlength: 3, maxlength: 160, required: true },
    slug: { type: String, unique: true, index: true },
    body: { type: {}, required: true, minlength: 200, maxlength: 2000000 },
    excerpt: { type: String, maxlength: 1000 },
    mtitle: { type: String },
    mdesc: { type: String },
    photo: { data: Buffer, contentType: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
