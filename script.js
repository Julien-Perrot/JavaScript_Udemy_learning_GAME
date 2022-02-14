// CREATION DU CANVAS :

window.onload = function () {
  let canvasWidth = 900;
  let canvasHeight = 600;
  let blockSize = 30;
  let ctx;
  let delay = 100;
  let snakee;
  let applee;
  let widthInBlock = canvasWidth / blockSize;
  let heightInBlock = canvasHeight / blockSize;
  let score;
  let timeout;

  init(); // j'execute ma fonction init

  function init() {

    let canvas = document.createElement("canvas");
    canvas.width = canvasWidth; // Largeur
    canvas.height = canvasHeight; // Hauteur
    // Style de notre élément 'canvas'
    canvas.style.border = "30px solid gray";
    canvas.style.margin = '50px auto';
    canvas.style.display = 'block';
    canvas.style.backgroundColor = '#ddd';

    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
      ],
      "right"
      
    );
    applee = new apple([10, 10]);
    score = 0;
    refreshCanvas();
  }

  // RAFRAÎCHIR LE CANVAS :

  function refreshCanvas() {
    snakee.avance();
    if (snakee.checkCollision()) {
      gameOver();
    } else {
      if (snakee.isEatApple(applee)) {
        score++;
        snakee.ateApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      montreScore();
      snakee.dessine();
      applee.dessineApple();
      timeout = setTimeout(refreshCanvas, delay);
    }
  }

  // CRÉATION DU BLOCK :

  function gameOver() {
    ctx.save();
    ctx.font = 'bold 50px sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    ctx.strokeText("Game Over", centerX, centerY - 180);
    ctx.fillText("Game Over", centerX, centerY -180);

    ctx.font = 'bold 30px sans-serif';
    ctx.strokeText('Appuyer sur la touche espace pour rejouer', centerX, centerY - 120);
    ctx.fillText('Appuyer sur la touche espace pour rejouer', centerX, centerY -120);
    ctx.restore();
  }

  function restart() {
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
      ],
      "right"
    );
    applee = new apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  }

  function montreScore() {
    ctx.save();
    ctx.font = 'bold 100px sans-serif';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;

    ctx.fillText(score.toString(), centerX, centerY);
    ctx.restore();
  }

  function dessineBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  // CRÉATION DU SERPENT :
  // &
  // DIRIGER LE SERPENT :

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.dessine = function () {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < this.body.length; i++) {
        dessineBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };

    // FAIRE AVANCER NOTRE SERPENT :

    this.avance = function () {
      let nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw "Invalid Direction";
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) {
        this.body.pop();
      } else {
        this.ateApple = false;
      }
    };

    this.setDirection = function (newDirection) {
      let allowedDirection;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirection = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirection = ["left", "right"];
          break;
        default:
          throw "Invalid Direction";
      }
      if (allowedDirection.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };

    // LE SERPENT S'EST IL PRIS UN MUR :

    this.checkCollision = function () {
      let murCollision = false;
      let snakeCollision = false;
      let head = this.body[0];
      let rest = this.body.slice(1);
      let snakeX = head[0];
      let snakeY = head[1];
      let minX = 0;
      let minY = 0;
      let maxX = widthInBlock - 1;
      let maxY = heightInBlock - 1;
      let murHorizon = snakeX < minX || snakeX > maxX;
      let murVertical = snakeY < minY || snakeY > maxY;

      if (murHorizon || murVertical) {
        murCollision = true;
      }

      for (let i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          snakeCollision = true;
        }
      }
      return murCollision || snakeCollision;
    };

    this.isEatApple = function (appleToEat) {
      let head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      ) {
        return true;
      } else {
        return false;
      }
    };
  }

  // AJOUTER LA POMME :

  function apple(position) {
    this.position = position;
    this.dessineApple = function () {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      let radius = blockSize / 2;
      let x = this.position[0] * blockSize + radius;
      let y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };

    this.setNewPosition = function () {
      let newX = Math.round(Math.random() * (widthInBlock - 1));
      let newY = Math.round(Math.random() * (heightInBlock - 1));
      this.position = [newX, newY];
    };

    this.isOnSnake = function (snakeToCheck) {
      let isOnSnake = false;

      for (let i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck[i][1]
        ) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }

  document.onkeydown = function handleKeyDown(e) {
    let key = e.keyCode;
    let newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  };
};