import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.dnd5eapi.co";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function getMonsters() {
  try {
    const monstersListURL = `${API_URL}/api/2014/monsters`;
    const response = await axios.get(monstersListURL);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching monsters by type:", error);
    res.status(500).send("Error fetching monsters by type");
  }
}
async function getMonsterDetails(url) {
  try {
    const monsterDetailsURL = `${API_URL}${url}`;
    const response = await axios.get(monsterDetailsURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching monster details:", error);
    res.status(500).send("Error fetching monster details");
  }
}

async function getRandomMonster() {
  try {
    const monstersListURL = `${API_URL}/api/2014/monsters`;
    const response = await axios.get(monstersListURL);
    const randomIndex = Math.floor(
      Math.random() * response.data.results.length,
    );
    const randomMonsterURL = `${response.data.results[randomIndex].url}`;
    const randomMonster = await getMonsterDetails(randomMonsterURL);
    return randomMonster;
  } catch (error) {
    console.error("Error fetching random monster:", error);
    res.status(500).send("Error fetching random monster");
  }
}

async function getSpells() {
  const spellsList = [];
  const spellsListURL = `${API_URL}/api/2014/spells`;
  const response = await axios.get(spellsListURL);
  try {
    for (const spell of response.data.results) {
      spellsList.push({ name: spell.name, url: spell.url });
    }
  } catch (error) {
    console.error("Error fetching spell types:", error);
    res.status(500).send("Error fetching spell types");
  }
  return spellsList;
}

async function getSpellDetails(name) {
  try {
    const spellDetailsURL = `${API_URL}${name}`;
    const response = await axios.get(spellDetailsURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching spell details:", error);
    res.status(500).send("Error fetching spell details");
  }
}

let monsters = [];
let selectedMonster = null;
let spells = [];
let selectedSpell = null;
let details;

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", {
      monsters: [],
      spells: [],
      details: {},
    });
  } catch (error) {
    console.error("Error fetching API data:", error);
    res.status(500).send("Error fetching API data");
  }
});

app.post("/get-monsters", async (req, res) => {
  try {
    spells = [];
    selectedSpell = null;
    monsters = await getMonsters();
    res.render("index.ejs", {
      monsters: monsters,
      selectedMonster: selectedMonster,
      spells: spells,
      selectedSpell: selectedSpell,
      details: details,
    });
  } catch (error) {
    console.error("Error fetching monsters:", error);
    res.status(500).send("Error fetching monsters");
  }
});

app.post("/get-monster-details", async (req, res) => {
  try {
    selectedMonster = req.body.type;
    const monsterDetails = await getMonsterDetails(selectedMonster);
    res.render("index.ejs", {
      monsters: monsters,
      selectedMonster: selectedMonster,
      spells: spells,
      selectedSpell: selectedSpell,
      details: { monsterDetails },
    });
  } catch (error) {
    console.error("Error fetching monster details:", error);
    res.status(500).send("Error fetching monster details");
  }
});

app.post("/get-random-monster", async (req, res) => {
  try {
    selectedSpell = null;
    const randomMonster = await getRandomMonster();
    res.render("index.ejs", {
      monsters: [], // Pass the random monster in an array
      selectedMonster: null,
      spells: [],
      selectedSpell: null,
      details: { randomMonster: randomMonster }, // Pass the random monster details
    });
  } catch (error) {
    console.error("Error fetching random monster:", error);
    res.status(500).send("Error fetching random monster");
  }
});

app.post("/get-spells", async (req, res) => {
  try {
    spells = await getSpells();
    monsters = [];
    selectedMonster = null;
    res.render("index.ejs", {
      monsters: monsters,
      selectedMonster: selectedMonster,
      spells: spells,
      selectedSpell: selectedSpell,
      details: {},
    });
  } catch (error) {
    console.error("Error fetching spells:", error);
    res.status(500).send("Error fetching spells");
  }
});

app.post("/get-spell-details", async (req, res) => {
  try {
    selectedSpell = req.body.type;
    const url = req.body.type;
    const spellDetails = await getSpellDetails(url);
    res.render("index.ejs", {
      monsters: monsters,
      selectedMonster: selectedMonster,
      spells: spells,
      selectedSpell: selectedSpell,
      details: { spellDetails },
    });
  } catch (error) {
    console.error("Error fetching spell details:", error);
    res.status(500).send("Error fetching spell details");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
