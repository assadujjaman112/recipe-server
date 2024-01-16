const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knxp44y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const recipeCollection = client.db("recipeDB").collection("recipe");

    app.get("/recipe", async (req, res) => {
      const result = await recipeCollection.find().toArray();
      res.send(result);
    });

    app.get("/recipe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.findOne(query);
      res.send(result);
    });

    app.post("/recipe", async (req, res) => {
      const recipe = req.body;
      const result = await recipeCollection.insertOne(recipe);
      res.send(result);
    });

    app.patch("/recipe/:id", async (req, res) => {
      const recipe = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedRecipe = {
        $set: {
          title: recipe.title,
          instruction: recipe.instruction,
          image: recipe.image,
          ingredients: recipe.ingredients,
        },
      };
      const result = await recipeCollection.updateOne(filter, updatedRecipe);
      res.send(result);
    });

    app.delete("/recipe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Recipe server is running.....");
});
app.listen(port, () => {
  console.log(`Recipe server is running on port ${port}`);
});
