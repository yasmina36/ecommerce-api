const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function () {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
});
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;