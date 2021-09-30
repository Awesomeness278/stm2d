function gameTick() {
  if (countdown > 0) {
    countdown -= 1 / tps;
  } else if (!done) {
    replay[time / (1000 / tps)] = [(("" + 1 * keyIsDown(left) + 1 * keyIsDown(right) + 1 * keyIsDown(jump) + 1 * keyIsDown(respawn)) * 1),[xpos,ypos]];
    time += 1000 / tps;
    let xAxis = -1 * keyIsDown(left) + 1 * keyIsDown(right);
    let jumpDown = keyIsDown(jump);
    if (abs(xAxis)) {
      if(xAxis/abs(xAxis) === xvel/abs(xvel) || xvel === 0){
        xvel += (xAxis * (xvel + 1) / 100 * 0.03);
      }else{
        xvel += (xAxis * (xvel + 1) / 100 * 0.09);
      }
    } else {
      xvel /= 1.025;
    }
    if(highFriction){
      xvel = min(max(-0.012,xvel),0.012)
    }
    if (jumpDown && canJump) {
      yvel = inWater?-0.025:-0.05;
      canJump = false;
    }
    yvel += inWater?0.00025:0.0005;
    ypos += yvel;
    if (ypos > 20 - 7.5 / 20) {
      ypos = 20 - 7.5 / 20;
      yvel = 0;
      canJump = true;
    }
    if (ypos < 7.5 / 20) {
      ypos = 7.5 / 20;
      yvel = 0;
    }
    inWater = false;
    let righ = ceil(xpos + 7.5 / 20) - 1;
    let lef = floor(xpos - 7.5 / 20);
    let bottom = ceil(ypos + 7.5 / 20) - 1;
    let top = floor(ypos - 7.5 / 20);
    try{
      if(level[bottom][lef] === 10 || level[bottom][righ] === 10 || level[bottom-1][lef] === 10 || level[bottom-1][righ] === 10){
        highFriction = true;
      }else{
        highFriction = false;
      }
    }catch(e){}
    if (yvel > 0 && (isCollidable(level[bottom][lef]) || isCollidable(level[bottom][righ]))) {
      if (checkCollision(lef, bottom) || checkCollision(righ, bottom)) {
        canJump = true;
        if(checkCollision(lef, bottom)){
          onCollide(level[bottom][lef],bottom,lef,true);
        }else if(checkCollision(righ, bottom)){
          onCollide(level[bottom][righ],bottom,righ,true);
        }
        if(yvel > 0){
          yvel = 0;
        }
        ypos = bottom - (7.5 / 20) - 0.005;
      }
    }
    if (yvel <= 0 && (isCollidable(level[top][lef]) || isCollidable(level[top][righ]))) {
      if (checkCollision(lef, top) || checkCollision(righ, top)) {
        if(checkCollision(lef, top)){
          onCollide(level[top][lef],top,lef,false);
        }else if(checkCollision(righ, top)){
          onCollide(level[top][righ],top,righ,false);
        }
        if(yvel < 0){
          yvel = 0;
        }
        ypos = top + (7.5 / 20) + 1 + 0.005;
      }
    }
    xpos += xvel;
    righ = ceil(xpos + 7.5 / 20) - 1;
    lef = floor(xpos - 7.5 / 20);
    bottom = ceil(ypos + 7.5 / 20) - 1;
    top = floor(ypos - 7.5 / 20);
    if (xvel < 0 && (isCollidable(level[top][lef]) || isCollidable(level[bottom][lef]))) {
      if (checkCollision(lef, top) || checkCollision(lef, bottom)) {
        if(checkCollision(lef, top)){
          onCollide(level[top][lef],top,lef,false);
        }else if(checkCollision(lef, bottom)){
          onCollide(level[bottom][lef],bottom,lef,true);
        }
        xpos = lef + 1 + 7.5 / 20 + 0.005;
        xvel = 0;
      }
    } else if (xvel > 0 && (isCollidable(level[top][righ]) || isCollidable(level[bottom][righ]))) {
      if (checkCollision(righ, top) || checkCollision(righ, bottom)) {
        if(checkCollision(righ, top)){
          onCollide(level[top][righ],top,righ,false);
        }else if(checkCollision(righ, bottom)){
          onCollide(level[bottom][righ],bottom,righ,true);
        }
        xpos = righ - (7.5 / 20) - 0.005;
        xvel = 0;
      }
    }
    if (checkCollision(righ, top)) {
      onCollide(level[top][righ], top, righ, false)
    }
    if (checkCollision(righ, bottom) && !died) {
      onCollide(level[bottom][righ], bottom, righ, true)
    }
    if (checkCollision(lef, bottom) && !died) {
      onCollide(level[bottom][lef], bottom, lef, true)
    }
    if (checkCollision(lef, top) && !died) {
      onCollide(level[top][lef], top, lef, false);
    }
    if (keyIsDown(respawn) || died) {
      xpos = lastCheckpointX;
      ypos = lastCheckpointY;
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          if(level[y][x] === 11){
            level[y][x] = 9;
          }
        }
      }
      sandTimers = [];
      xvel = 0;
      yvel = 0;
      died = false;
    }
    if (xpos < 7.5 / 20) {
      xpos = 7.5 / 20;
      xvel = 0;
    }
    if (xpos > 20 - 7.5 / 20) {
      xpos = 20 - 7.5 / 20;
      xvel = 0;
    }
    let del = [];
    for(let i = 0; i < sandTimers.length; i++){
      sandTimers[i].timer--;
      if(sandTimers[i].timer < 0){
        level[sandTimers[i].y][sandTimers[i].x] = 11;
        del.push(sandTimers);
      }
    }
    for(let i = 0; i < del.length; i++){
      sandTimers.splice(del[i],1);
    }
  }
  if (keyIsDown(giveUp)) {
    reset();
  }
}

function checkCollision(rx, ry) {
  let distance = dist(rx + 0.5, ry + 0.5, xpos, ypos);
  let clampDst = clamp(distance, 1, 1);
  let closestPointX = rx + 0.5 + clampDst;
  let closestPointY = ry + 0.5 + clampDst;
  let magnitude = dist(0, 0, closestPointX - xpos, closestPointY - ypos);
  return magnitude ** 2 > 7.5 / 20;
}

function onCollide(objectID, y, x, bottom) {
  switch (objectID) {
    case 3:
      gottenCheckpoints++;
      level[y][x] = 5;
      lastCheckpointX = x + 0.5;
      lastCheckpointY = y + 0.5;
      checkpointTimes[gottenCheckpoints - 1] = time;
      break;
    case 4:
      if (gottenCheckpoints === checkpointCount) {
        done = true;
        prevTime = bestTime;
        if (time < bestTime) {
          bestTime = time;
          bestCheckpoints = checkpointTimes.slice();
          checkpointTimes = [];
          bestReplay = replay.slice();
          replay = [];
          if (isClientConnected(display = false)) {
            sendData("PB", { time: time, replay: bestReplay });
          }
        }
      }
      break;
    case 6:
      xpos = lastCheckpointX;
      ypos = lastCheckpointY;
      xvel = 0;
      yvel = 0;
      died = true;
      break;
    case 7:
      if(bottom){
        yvel = -yvel * 0.8038;
        canJump = true;
      }
      break;
    case 8:
      canJump = true;
      inWater = true;
      break;
    case 9:
      let exists = false;
      for(let i = 0; i < sandTimers.length; i++){
        if(sandTimers[i].x === x && sandTimers[i].y === y){
          exists = true;
        }
      }
      if(!exists){
        sandTimers.push({x:x,y:y,timer:sandFallTime});
      }
      canJump = true;
      break;
    case 10:
      highFriction = true;
      break;
  }
}

function isCollidable(id){
  let solidBlocks = [10,9,7,1];
  return solidBlocks.indexOf(id)!==-1;
}