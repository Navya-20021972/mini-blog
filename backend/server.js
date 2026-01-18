import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// --- JWT auth middleware ---
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user; // store logged-in user info
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};


app.get("/", (req, res) => res.send("Mini Blog Backend is running!"));


app.use("/posts", authenticate);


app.post("/posts", async (req, res) => {
  const { title, content, tags } = req.body;
  const { data, error } = await supabase.from("posts").insert([
    { title, content, tags, user_id: req.user.id }
  ]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});


app.get("/posts", async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});


app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("user_id", req.user.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});


app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .update({ title, content, tags })
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});


app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Post deleted", data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
