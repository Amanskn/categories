const mongoose = require("mongoose");

// Connect to your MongoDB database (make sure to replace the connection string with your own)
mongoose
  .connect("mongodb://localhost/categoryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection to MongoDB failed: " + error);
  });

const categorySchema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Category = mongoose.model("Category", categorySchema);

async function createCategory(name, parent = null) {
  const category = new Category({ name, parent });
  await category.save();

  if (parent) {
    parent.subcategories.push(category);
    await parent.save();
  }

  return category;
}

async function getSubcategories(categoryId) {
  return Category.findById(categoryId).populate("subcategories");
}

(async () => {
  const electronics = await createCategory("Electronics");
  const clothing = await createCategory("Clothing");
  const smartphones = await createCategory("Smartphones", electronics);
  const laptops = await createCategory("Laptops", electronics);
  const android = await createCategory("Android", smartphones);

  console.log(await getSubcategories(electronics._id));
  console.log(await getSubcategories(smartphones._id));
})();
