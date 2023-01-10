let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");

let app = express();
let dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

function getCamelCaseObject(eachPlayer) {
  return {
    playerId: eachPlayer.player_id,
    playerName: eachPlayer.player_name,
    jerseyNumber: eachPlayer.jersey_number,
    role: eachPlayer.role,
  };
}

app.get("/players/", async (request, response) => {
  let getAllPlayersDetails = `SELECT * FROM cricket_team;`;

  let dbResponse = await db.all(getAllPlayersDetails);
  let players = dbResponse.map((eachPlayer) => getCamelCaseObject(eachPlayer));
  response.send(players);
});

app.post("/players/", async (request, response) => {
  let postingData = ` INSERT INTO cricket_team(player_name,jersey_number,role) 
       VALUES ("Vishal",${17},"Bowler");`;
  const dbResponse = db.run(postingData);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let getPlayerDetails = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;

  let playerArray = await db.get(getPlayerDetails);
  let playerD = getCamelCaseObject(playerArray);
  response.send(playerD);
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let updating = `UPDATE cricket_team SET 
    player_name="Maneesh",jersey_number=${54},role="All-rounder" WHERE player_id = ${playerId} ;`;
  await db.run(updating);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});
module.exports = app;
