function reset() {
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
  gottenCheckpoints = 0;
  rGottenCheckpoints = {};
  sandTimers = [];
  time = 0;
  lastCheckpointX = startX;
  lastCheckpointY = startY;
  rlastCheckpointX = startX;
  rlastCheckpointY = startY;
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      if (level[y][x] === 5) {
        level[y][x] = 3;
      }
      if(level[y][x] === 11){
        level[y][x] = 9;
      }
    }
  }
  done = false;
  rdone = false;
  rcanJump = false;
  canJump = false;
}

function resetStuff() {
  checkpointCount = -1;
  gottenCheckpoints = 0;
  bestCheckpoints = [];
  startX = -1;
  replay = [];
  bestReplay = [];
  bestTime = Infinity;
  prevTime = Infinity;
}

function checkpointReset(){
  
}

function render(x, y) {
  let offset = screen === "EDITOR" ? 200*screenScale : 0;
  switch (level[y][x]) {
    case 0:
      break;
    case 1:
      fill(0);
      rect(x * 20*screenScale - offset, y * 20*screenScale - offset, 20*screenScale, 20*screenScale);
      break;
    case 2:
      fill(0, 255, 0, 100);
      rect(x * 20*screenScale - offset, y * 20*screenScale - offset, 20*screenScale, 20*screenScale);
      break;
    case 3:
      fill(0, 0, 255, 100);
      rect(x * 20*screenScale - offset, y * 20*screenScale - offset, 20*screenScale, 20*screenScale);
      break;
    case 4:
      fill(255, 0, 0, 100);
      rect(x * 20*screenScale - offset, y * 20*screenScale - offset, 20*screenScale, 20*screenScale);
      break;
    case 5:
      fill(0, 100, 255, 100);
      rect(x * 20*screenScale - offset, y * 20*screenScale - offset, 20*screenScale, 20*screenScale);
      break;
    case 6:
      fill(255, 0, 0);
      rect(x * 20*screenScale - offset, y * 20*screenScale - offset, 20*screenScale, 20*screenScale);
      break;
    case 7:
      fill(0,100,0);
      rect(x*20*screenScale-offset, y*20*screenScale-offset,20*screenScale,20*screenScale);
      break;
    case 8:
      fill(0,0,100,50);
      rect(x*20*screenScale-offset, y*20*screenScale-offset,20*screenScale,20*screenScale);
      break;
    case 9:
      fill(194, 178, 128);
      rect(x*20*screenScale-offset, y*20*screenScale-offset,20*screenScale,20*screenScale);
      break;
    case 10:
      fill(120,90,70);
      rect(x*20*screenScale-offset, y*20*screenScale-offset,20*screenScale,20*screenScale);
      break;
  }
}

function invert(c) {
  let L = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255
  let S = ((max(c[0], c[1], c[2]) - min(c[0], c[1], c[2])) / max(c[0], c[1], c[2])) / 255;
  return 255 - round(L) * 255;
}

function clamp(val, min, max) {
  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  } else {
    return val;
  }
}

function submitLevel(){
  ref.push({levelName:name,pending:true,level:level,replay:bestReplay},(e)=>{window.err = e});
  validated = false;
  if(topButtons[4]){
    topButtons.splice(4,1);
  }
  topButtons[1].onclick();
}