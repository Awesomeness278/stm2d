const serverIp = 'https://stm2d.glitch.me';
const serverPort = '3000';
const local = false;
let scroll = 0;
let screen = "MENU";
let online = false;
let connecting = false;
let inWater = false;
let highFriction = false;
let cameraX = 200, cameraY = 200;
let zoom = 1;
let selected = 0;
let died = false;
let screenScale = 1;
let name = "";
let version = "client v1.0.1";
let lastUpdated = "9/30/21";
let validated = false;
let objects = [{ name: "Air", col: [255, 255, 255, 0], id: 0 }, { name: "Wall", col: [0, 0, 0], id: 1 }, { name: "Start", col: [0, 255, 0, 100], id: 2 }, { name: "CP", col: [0, 0, 255, 100], id: 3 }, { name: "Finish", col: [255, 0, 0, 100], id: 4 }, { name: "Spikes", col: [255, 0, 0], id: 6 }, { name: "Slime", col: [0, 100, 0], id: 7 }, { name: "Water", col: [0, 0, 100], id: 8 }, { name: "Sand", col: [194, 178, 128], id: 9 }, { name: "Mud", col: [120, 90, 40], id: 10 }];
let categories = [{ name: "Solid", indexes: [1, 6, 8, 9] }, { name: "Time", indexes: [2, 3, 4] }, { name: "Non-Solid", indexes: [0,7] }, {name: "Hazards", indexes: [5]}];
let topButtons = [{
  name: "Validate", onclick: () => {
    screen = "VALIDATE";
    if (topButtons[4]) {
      topButtons.splice(4, 1);
    }
    validated = false;
    countdown = 3;
    xpos = startX;
    xvel = 0;
    ypos = startY;
    yvel = 0;
    rxpos = startX;
    rxvel = 0;
    rypos = startY;
    ryvel = 0;
    replay = [];
    startX = -1;
    gottenCheckpoints = 0;
    rGottenCheckpoints = {};
    time = 0;
    checkpointCount = -1;
    lastCheckpointX = startX;
    lastCheckpointY = startY;
    rlastCheckpointX = startX;
    rlastCheckpointY = startY;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (level[y][x] === 5) {
          level[y][x] = 3;
        }
      }
    }
    done = false;
    rdone = false;
    rcanJump = false;
  }
}, {
  name: "Clear", onclick: () => {
    level.forEach((i, j) => (level[j].forEach((it, ind) => (level[j][ind] = 0)))); if (topButtons[4]) {
      topButtons.splice(4, 1);
    }
    validated = false;
  }
}, {
  name: "Save", onclick: () => {
    storeItem("level", level);
  }
}, {
  name: "Load", onclick: () => {
    level = getItem("level");
  }
}]
let done = false;
let canJump = false;
let xpos = 1.5;
let ypos = 18.5;
let xvel = 0;
let yvel = 0;
let rxpos = 1.5;
let rypos = 18.5;
let rxvel = 0;
let ryvel = 0;
let rdone = false;
let rcanJump = false;
let time = 0;
let checkpointCount = -1;
let gottenCheckpoints = 0;
let tps = 100;
let timeWithoutTicks = 0;
let countdown = 3;
let lastCheckpointX = 1.5;
let lastCheckpointY = 18.5;
let rlastCheckpointX = 1.5;
let rlastCheckpointY = 18.5;
let checkpointTimes = [];
let bestCheckpoints = Array.from({ length: checkpointCount }, () => Infinity);
let bestTime = Infinity;
let improvement = "";
/*
0 - Air
1 - Wall
2 - Start
3 - Not gotten checkpoint
4 - End
5 - Gotten checkpoint
6 - Hazard
*/
let level = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
let rGottenCheckpoints = {};
let replay = [];
let bestReplay = [];
let prevTime = Infinity;
let startX = -1;
let startY = -1;
let players = {};
let firstLevel = false;
let position = -1;
let leaderboard = [];
let timer = 0;
let wr = Infinity;
let escDown = false;
let left = p5.prototype.getItem("left") || 37;
let right = p5.prototype.getItem("right") || 39;
let jump = p5.prototype.getItem("jump") || 38;
let respawn = p5.prototype.getItem("respawn") || 13;
let giveUp = p5.prototype.getItem("giveUp") || 8;
let selectedInput = -1;
let sandTimers = [];
let sandFallTime = 25;