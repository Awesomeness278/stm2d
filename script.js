function setup() {
  let cnv = createCanvas(min(windowHeight/400,windowWidth/500)*400, min(windowHeight/400,windowWidth/500)*400);
  cnv.mouseWheel((event) => (scroll += event.deltaY));
  window.ref = database.ref("levels");
  screenScale = height/400;
  cameraX = 200*screenScale;
  cameraY = 200*screenScale;  
}

function draw() {
  if (screen === "PLAY" && connected) {
    let cnv = createCanvas(min(windowHeight/400,windowWidth/500)*500, min(windowHeight/400,windowWidth/500)*400);
    cnv.mouseWheel((event) => (scroll += event.deltaY));
  } else {
    let cnv = createCanvas(min(windowHeight/400,windowWidth/500)*400, min(windowHeight/400,windowWidth/500)*400);
    cnv.mouseWheel((event) => (scroll += event.deltaY));
  }
  if (screen === "SETTINGS") {
    background(0);
    fill(255);
    rect(0, 0, 200*screenScale, 50*screenScale);
    rect(0, 50*screenScale, 200*screenScale, 50*screenScale);
    rect(0, 100*screenScale, 200*screenScale, 50*screenScale);
    rect(0, 150*screenScale, 200*screenScale, 50*screenScale);
    rect(0, 200*screenScale, 200*screenScale, 50*screenScale);
    fill(0);
    textAlign(CENTER, CENTER);
    text("left: " + left, 0, 0, 200*screenScale, 50*screenScale);
    text("right: " + right, 0, 50*screenScale, 200*screenScale, 50*screenScale);
    text("jump: " + jump, 0, 100*screenScale, 200*screenScale, 50*screenScale);
    text("respawn: " + respawn, 0, 150*screenScale, 200*screenScale, 50*screenScale);
    text("give up: " + giveUp, 0, 200*screenScale, 200*screenScale, 50*screenScale);
    if (mouseX > 0 && mouseX < 200*screenScale && mouseIsPressed) {
      if (mouseY > 0 && mouseY < 50*screenScale) {
        selectedInput = 0;
      }
      if (mouseY > 50*screenScale && mouseY < 100*screenScale) {
        selectedInput = 1;
      }
      if (mouseY > 100*screenScale && mouseY < 150*screenScale) {
        selectedInput = 2;
      }
      if (mouseY > 150*screenScale && mouseY < 200*screenScale) {
        selectedInput = 3;
      }
      if (mouseY > 200*screenScale && mouseY < 250*screenScale) {
        selectedInput = 4;
      }
    }
    if (keyIsPressed && selectedInput !== -1) {
      let input = keyCode;
      if (selectedInput === 0) {
        left = input;
        storeItem("left", input);
      }
      if (selectedInput === 1) {
        right = input;
        storeItem("right", input);
      }
      if (selectedInput === 2) {
        jump = input;
        storeItem("jump", input);
      }
      if (selectedInput === 3) {
        respawn = input;
        storeItem("respawn", input);
      }
      if (selectedInput === 4) {
        giveUp = input;
        storeItem("giveUp", input);
      }
      selectedInput = -1;
    }
  } else if (screen === "MENU") {
    push();
    background(0);
    fill(255);
    textStyle(BOLD);
    textSize(30*screenScale);
    rect(350*screenScale, 0, 50*screenScale, 50*screenScale);
    textAlign(CENTER, TOP);
    text("STM2D", 20*screenScale, 20*screenScale, 360*screenScale, 360*screenScale);
    rectMode(CENTER);
    rect(200*screenScale, 80*screenScale, 200*screenScale, 40*screenScale);
    rect(200*screenScale, 130*screenScale, 200*screenScale, 40*screenScale);
    rect(200*screenScale, 180*screenScale, 200*screenScale, 40*screenScale);
    fill(0);
    textAlign(CENTER, CENTER);
    text("O", 375*screenScale, 25*screenScale);
    textAlign(CENTER, CENTER);
    text("PLAY", 200*screenScale, 80*screenScale, 200*screenScale, 40*screenScale);
    text("CREATE", 200*screenScale, 130*screenScale, 200*screenScale, 40*screenScale);
    text("SOLO", 200*screenScale, 180*screenScale, 200*screenScale, 40*screenScale);
    textSize(10*screenScale);
    textAlign(CENTER, BOTTOM);
    fill(255);
    text(version + "(" + lastUpdated + ")", 200*screenScale, 200*screenScale, 400*screenScale, 400*screenScale);
    pop();
    if (mouseX > 350*screenScale && mouseX < 400*screenScale && mouseY > 0 && mouseY < 50*screenScale && mouseIsPressed) {
      screen = "SETTINGS"
    }
    if (mouseX > 100*screenScale && mouseX < 300*screenScale && mouseIsPressed) {
      if (mouseY > 60*screenScale && mouseY < 100*screenScale) {
        screen = "PLAY";
        online = true;
        scroll = 0;
      }
      if (mouseY > 110*screenScale && mouseY < 150*screenScale) {
        screen = "EDITOR"
      }
      if (mouseY > 160*screenScale && mouseY < 200*screenScale) {
        screen = "LEVEL_SELECT";
        scroll = 0;
      }
    }
  } else if (screen === "LEVEL_SELECT") {
    background(0);
    if (window.levels) {
      if (window.levels !== true) {
        let keys = Object.keys(window.levels);
        scroll = min(max(0, scroll), keys.length * 60*screenScale - 60*screenScale)
        for (let i = 0; i < keys.length; i++) {
          push();
          rect(100*screenScale, 20*screenScale + i * 60*screenScale - scroll, 200*screenScale, 40*screenScale);
          textAlign(CENTER, CENTER);
          textStyle(BOLD);
          text(window.levels[keys[i]].levelName.toUpperCase(), 100*screenScale, 20*screenScale + i * 60*screenScale - scroll, 200*screenScale, 40*screenScale);
          if (mouseIsPressed) {
            if (mouseX > 100*screenScale && mouseX < 300*screenScale) {
              if (mouseY > 20*screenScale + i * 60*screenScale - scroll && mouseY < 60*screenScale + i * 60*screenScale - scroll) {
                level = window.levels[keys[i]].level.slice();
                screen = "PLAY";
              }
            }
          }
          pop();
        }
      }
    } else {
      window.levels = true;
      ref.get().then((v) => (window.levels = v.val()));
    }
  } else if (screen === "VALIDATE") {
    background(220);
    if (checkpointCount === -1) {
      checkpointCount = 0;
      for (let i = 0; i < level.length; i++) {
        for (let l = 0; l < level[i].length; l++) {
          if (level[i][l] === 3) {
            checkpointCount++;
          }
        }
      }
    }
    if (startX === -1) {
      for (let i = 0; i < level.length && startX === -1; i++) {
        for (let l = 0; l < level[i].length && startX === -1; l++) {
          if (level[i][l] === 2) {
            startX = l + 0.5;
            startY = i + 0.5;
            lastCheckpointX = startX;
            lastCheckpointY = startY;
            xpos = startX;
            ypos = startY;
            rlastCheckpointX = startX;
            rlastCheckpointY = startY;
            rxpos = startX;
            rypos = startY;
          }
        }
      }
    }
    textAlign(CENTER, BOTTOM);
    let timeFormatted = time / 1000 + "";
    fill(169, 50);
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        render(x, y);
      }
    }
    if(bestReplay[time/(1000/tps)]){
      circle(bestReplay[time/(1000/tps)][1][0] * 20*screenScale || -20*screenScale, bestReplay[time/(1000/tps)][1][1] * 20*screenScale || -20*screenScale, 15*screenScale);
    }
    fill(255, 255, 0);
    circle(xpos * 20*screenScale, ypos * 20*screenScale, 15*screenScale);
    fill(255);
    textSize(20*screenScale);
    if (timeFormatted.indexOf(".") === -1) {
      text(timeFormatted + ".00", 0, 0, 400*screenScale, 400*screenScale);
    } else {
      text(time / 1000 + Array.from({ length: 2 - ((timeFormatted).slice((timeFormatted).indexOf(".") + 1, (timeFormatted).length).length) }, () => "0").join(""), 0, 0, 400*screenScale, 400*screenScale);
    }
    textAlign(CENTER, TOP);
    let improvement = (checkpointTimes[gottenCheckpoints - 1] - bestCheckpoints[gottenCheckpoints - 1]);
    if (gottenCheckpoints === checkpointCount && done) {
      improvement = (time - prevTime);
    }
    if (improvement === -Infinity || isNaN(improvement)) {
      improvement = "";
    } else {
      improvement = improvement / 1000 + "";
      if (improvement.indexOf(".") === -1) {
        improvement = improvement + ".00";
      } else {
        improvement = improvement + Array.from({ length: 2 - ((improvement).slice((improvement).indexOf(".") + 1, (improvement).length).length) }, () => "0").join("");
      }
    }
    if (improvement < 0) {
      fill("blue");
    } else if (improvement > 0) {
      fill("red");
    } else {
      fill("green")
    }
    improvement = (improvement > 0 ? "+" : "") + improvement;
    text(improvement, 0, 0, 400*screenScale, 400*screenScale);
    timeWithoutTicks += !isNaN(deltaTime / deltaTime) ? deltaTime : 0;
    while (timeWithoutTicks > 1000 / tps) {
      gameTick();
      timeWithoutTicks -= 1000 / tps;
    }
    if (countdown > 0) {
      fill(0, 0, 255);
      textSize(40*screenScale);
      textAlign(CENTER, CENTER);
      text(ceil(countdown), 0, 0, 400*screenScale, 400*screenScale);
    }
    if (done) {
      validated = true;
      name = prompt("Enter a name for this level.");
      topButtons.push({ name: "Submit", onclick: submitLevel });
      screen = "EDITOR";
      reset();
      resetStuff();
    }
  } else if (screen === "EDITOR") {
    if(keyIsDown(83)){
      storeItem("level",level);
    }
    if(keyIsDown(49)){
      selected = 0;
    }
    if(keyIsDown(50)){
      selected = 1;
    }
    if(keyIsDown(51)){
      selected = 2;
    }
    if(keyIsDown(52)){
      selected = 3;
    }
    if(keyIsDown(53)){
      selected = 4;
    }
    if(keyIsDown(54)){
      selected = 5;
    }
    if(keyIsDown(55)){
      selected = 6;
    }
    if(keyIsDown(56)){
      selected = 7;
    }
    if(keyIsDown(57)){
      selected = 8;
    }
    if(keyIsDown(48)){
      selected = 9;
    }
    if(keyIsDown(76)){
      level = getItem("level");
    }
    background(220);
    push();
    translate(cameraX, cameraY);
    scale(zoom);
    if (keyIsDown(38)) {
      cameraY += 2 * 1 / zoom;
    }
    if (keyIsDown(40)) {
      cameraY -= 2 * 1 / zoom;
    }
    if (keyIsDown(37)) {
      cameraX += 2 * 1 / zoom;
    }
    if (keyIsDown(39)) {
      cameraX -= 2 * 1 / zoom;
    }
    if (keyIsDown(187)) {
      zoom *= 1.01;
    }
    if (keyIsDown(189)) {
      zoom /= 1.01;
    }
    noFill();
    rect(-200*screenScale, -200*screenScale, level[0].length * 20*screenScale, level.length * 20*screenScale);
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        render(x, y);
        if ((mouseX - cameraX) / zoom < x * 20*screenScale - 180*screenScale && (mouseX - cameraX) / zoom > x * 20*screenScale - 200*screenScale && (mouseY - cameraY) / zoom < y * 20*screenScale - 180*screenScale && (mouseY - cameraY) / zoom > y * 20*screenScale - 200*screenScale && mouseY < 360*screenScale && mouseY > 40*screenScale) {
          if (mouseIsPressed) {
            level[y][x] = objects[selected].id;
            validated = false;
            if (topButtons[4]) {
              topButtons.splice(4, 1);
            }
            startX = -1;
            checkpointAmount = -1;
            bestReplay = [];
            replay = [];
          }
        }
      }
    }
    pop();
    fill(255, 255, 255);
    rect(0, 360*screenScale, 400*screenScale, 40*screenScale);
    rect(0, 0, 400*screenScale, 40*screenScale);
    for (let i = 0; i < 10; i++) {
      strokeWeight(selected === i ? 4 : 1);
      stroke(selected === i ? [255, 0, 0] : [0, 0, 0]);
      if (objects[i]) {
        fill(objects[i].col);
      } else {
        fill(0, 0, 0, 0);
      }
      rect(i * 40*screenScale, 360*screenScale, 40*screenScale, 40*screenScale);
      if (objects[i]) {
        textSize(8*screenScale)
        noStroke();
        fill(invert(objects[i].col));
        textAlign(CENTER, CENTER);
        text(objects[i].name, i * 40*screenScale, 360*screenScale, 40*screenScale, 40*screenScale);
      }
      strokeWeight(1);
      if (mouseX > i * 40*screenScale && mouseX < i * 40*screenScale + 40*screenScale && mouseY > 360*screenScale && mouseY < 400*screenScale) {
        if (mouseIsPressed) {
          selected = i;
        }
      }
    }
    for (let i = 0; i < topButtons.length; i++) {
      fill(255);
      strokeWeight(1);
      stroke(0);
      rect(i * 40*screenScale, 0, 40*screenScale, 40*screenScale);
      noStroke();
      fill(0);
      if (topButtons[i]) {
        text(topButtons[i].name, i * 40*screenScale, 0, 40*screenScale, 40*screenScale);
        if (mouseX > i * 40*screenScale && mouseX < i * 40*screenScale + 40*screenScale && mouseY > 0 && mouseY < 40*screenScale) {
          if (mouseIsPressed) {
            topButtons[i].onclick();
          }
        }
      }
      stroke(0);
      strokeWeight(1);
    }
  } else if (screen === "PLAY") {
    background(220);
    if (online) {
      if (connecting) {
        if(isClientConnected(display=false)){
          sendData("position", { x: xpos, y: ypos });
        }
      } else {
        setupClient();
        connecting = true;
      }
    }
    if (checkpointCount === -1) {
      for (let i = 0; i < 20; i++) {
        for (let l = 0; l < 20; l++) {
          if (level[l][i] === 5) {
            level[l][i] = 3;
          }
        }
      }
      checkpointCount = 0;
      for (let i = 0; i < level.length; i++) {
        for (let l = 0; l < level[i].length; l++) {
          if (level[i][l] === 3) {
            checkpointCount++;
          }
        }
      }
    }
    if (startX === -1) {
      for (let i = 0; i < level.length && startX === -1; i++) {
        for (let l = 0; l < level[i].length && startX === -1; l++) {
          if (level[i][l] === 2) {
            startX = l + 0.5;
            startY = i + 0.5;
            lastCheckpointX = startX;
            lastCheckpointY = startY;
            xpos = startX;
            ypos = startY;
            rlastCheckpointX = startX;
            rlastCheckpointY = startY;
            rxpos = startX;
            rypos = startY;
          }
        }
      }
    }
    textAlign(CENTER, BOTTOM);
    let timeFormatted = time / 1000 + "";
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        render(x, y);
      }
    }
    fill(169, 50);
    if(bestReplay[time/(1000/tps)]){
      circle(bestReplay[time/(1000/tps)][1][0] * 20*screenScale || -20*screenScale, bestReplay[time/(1000/tps)][1][1] * 20*screenScale || -20*screenScale, 15*screenScale);
    }
    fill(255, 255, 0);
    circle(xpos * 20*screenScale, ypos * 20*screenScale, 15*screenScale);
    fill(255);
    textSize(20*screenScale);
    if (timeFormatted.indexOf(".") === -1) {
      text(timeFormatted + ".00", 0, 0, 400*screenScale, 400*screenScale);
    } else {
      text(time / 1000 + Array.from({ length: 2 - ((timeFormatted).slice((timeFormatted).indexOf(".") + 1, (timeFormatted).length).length) }, () => "0").join(""), 0, 0, 400*screenScale, 400*screenScale);
    }
    textAlign(RIGHT, BOTTOM);
    text(round(timer), 0, 0, 400*screenScale, 400*screenScale);
    fill(255);
    rect(400*screenScale, 0, 100*screenScale, 400*screenScale);
    fill(0);
    if (connected) {
      for (let i = 0; i < leaderboard.length; i++) {
        text((i + 1) + ": " + (leaderboard[i].time / 1000).toFixed(2), 400*screenScale, i * 20*screenScale, 100*screenScale, 50*screenScale);
      }
      text("wr: " + (wr / 1000).toFixed(2), 400*screenScale, 0, 100*screenScale, 20*screenScale);
    }
    textAlign(CENTER, TOP);
    let improvement = (checkpointTimes[gottenCheckpoints - 1] - bestCheckpoints[gottenCheckpoints - 1]);
    if (gottenCheckpoints === checkpointCount && done) {
      improvement = (time - prevTime);
    }
    if (improvement === -Infinity || isNaN(improvement)) {
      improvement = "";
    } else {
      improvement = improvement / 1000 + "";
      if (improvement.indexOf(".") === -1) {
        improvement = improvement + ".00";
      } else {
        improvement = improvement + Array.from({ length: 2 - ((improvement).slice((improvement).indexOf(".") + 1, (improvement).length).length) }, () => "0").join("");
      }
    }
    if (improvement < 0) {
      fill("blue");
    } else if (improvement > 0) {
      fill("red");
    } else {
      fill("green")
    }
    improvement = (improvement > 0 ? "+" : "") + improvement;
    text(improvement, 0, 0, 400*screenScale, 400*screenScale);
    if (isClientConnected(display = false)) {
      push();
      textAlign(RIGHT, TOP);
      fill(255);
      text((position === -1 ? "?" : position + 1) + "/" + Object.keys(players).length, 0, 0, 400*screenScale, 400*screenScale);
      pop();
    }
    timeWithoutTicks += !isNaN(deltaTime / deltaTime) ? deltaTime : 0;
    while (timeWithoutTicks > 1000 / tps) {
      gameTick();
      timeWithoutTicks -= 1000 / tps;
    }
    if (countdown > 0) {
      fill(0, 0, 255);
      textSize(40*screenScale);
      textAlign(CENTER, CENTER);
      text(ceil(countdown), 0, 0, 400*screenScale, 400*screenScale);
    }
    for (let p in players) {
      if (players[p].id !== id) {
        fill(100, 100, 0);
        circle(players[p].x * 20*screenScale, players[p].y * 20*screenScale, 15*screenScale);
      }
    }
    if (isClientConnected(display = false)) {
      if(window.vote !== undefined){
        if(window.vote){
          fill('green');
          rect(400*screenScale,380*screenScale,100*screenScale,20*screenScale);
        }else{
          fill('red');
          rect(400*screenScale,380*screenScale,100*screenScale,20*screenScale);
        }
      }
      fill('green');
      circle(410*screenScale, 390*screenScale, 10*screenScale);
      fill('red');
      circle(430*screenScale, 390*screenScale, 10*screenScale);
      try{
      if (dist(mouseX, mouseY, 410*screenScale, 390*screenScale) < 5) {
        if (mouseIsPressed) {
          sendData("vote", { vote: "up" });
          if(undefined === window.vote){
            window.vote = true;
          }
          window.vote = true;
        }
      }
      if (dist(mouseX, mouseY, 430*screenScale, 390*screenScale) < 5) {
        if (mouseIsPressed) {
          sendData("vote", { vote: "down" });
          if(undefined === window.vote){
            window.vote = false;
          }
          window.vote = false;
        }
      }
      }catch(e){
        window.error = e;
      }
    }
  }
  if (keyIsDown(27) && !escDown) {
    escDown = true;
    switch (screen) {
      case "VALIDATE":
        screen = "EDITOR";
        reset();
        resetStuff();
        break;
      case "PLAY":
        document.location.reload()
        break;
      default:
        screen = "MENU";
    }
  }
  if (!keyIsDown(27)) {
    escDown = false;
  }
}