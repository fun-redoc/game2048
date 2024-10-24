import "./style.css";

/*
 * types
 */
interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PlayField {
  topButtonRow: Rect[];
  bottomButtonRow: Rect[];
  leftButtonCol: Rect[];
  rightButtonCol: Rect[];
  field: Rect[][]; //[row][col]
}

type GameEvent =
  | {
      kind: "playLeft";
      row: number;
    }
  | {
      kind: "playRight";
      row: number;
    }
  | {
      kind: "playUp";
      col: number;
    }
  | {
      kind: "playDown";
      col: number;
    }
  | {
      kind: "setFour";
      row: number;
      col: number;
    }
  | {
      kind: "setTwo";
      row: number;
      col: number;
    }
  | {
      kind: "restart";
      k: number;
    }
  | {
      kind: "noop";
    };

/*
 * variables
 */
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const inputK = document.getElementById("k")! as HTMLInputElement;
const buttonRnd = document.getElementById("rnd")! as HTMLButtonElement;

let k: number = Number.parseInt(inputK.value) | 3;
let field: number[][] = [];

const buttonsConfig = {
  vertButtonWidth: 50,
  horzButtonHeigth: 50,
};

let playField: PlayField = {
  topButtonRow: [],
  bottomButtonRow: [],
  leftButtonCol: [],
  rightButtonCol: [],
  field: [],
};

const evtQueue: GameEvent[] = [];

/*
 * browser event handlers
 */
buttonRnd.onclick = () => {
  // find empty fields
  const emptyFields: Point[] = [];
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
      if (!field[r][c]) {
        emptyFields.push({ x: c, y: r });
      }
    }
  }
  // randomly choose empty field
  if (emptyFields && emptyFields.length > 0) {
    const randomEmptyFieldIdx = Math.floor(Math.random() * emptyFields.length);
    const randomEmptyFieldCoords = emptyFields[randomEmptyFieldIdx];

    // randomly choose 4 or 2
    const choice: number[] = [4, 2];
    const chosen = choice[Math.floor(Math.random() * choice.length)];
    switch (chosen) {
      case 2:
        evtQueue.push({
          kind: "setTwo",
          row: randomEmptyFieldCoords.y,
          col: randomEmptyFieldCoords.x,
        });
        break;
      case 4:
        evtQueue.push({
          kind: "setFour",
          row: randomEmptyFieldCoords.y,
          col: randomEmptyFieldCoords.x,
        });
        break;
      default:
        console.error(`something wrong, unexpected value ${chosen}`);
    }
    // issue set event
  }
};
inputK.onchange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.value) {
    const newK = Number.parseInt(target.value);
    evtQueue.push({ kind: "restart", k: newK });
  }
};
canvas.onmouseup = (e: MouseEvent) => {
  const p = { x: e.offsetX, y: e.offsetY };
  let evt: GameEvent | undefined = undefined;
  for (let i = 0; i < playField.topButtonRow.length; i++) {
    if (isInRect(p, playField.topButtonRow[i])) {
      evt = { kind: "playUp", col: i };
      break;
    }
  }
  if (evt === undefined) {
    for (let i = 0; i < playField.bottomButtonRow.length; i++) {
      if (isInRect(p, playField.bottomButtonRow[i])) {
        evt = { kind: "playDown", col: i };
        break;
      }
    }
  }
  if (evt === undefined) {
    for (let i = 0; i < playField.leftButtonCol.length; i++) {
      if (isInRect(p, playField.leftButtonCol[i])) {
        evt = { kind: "playLeft", row: i };
        break;
      }
    }
  }
  if (evt === undefined) {
    for (let i = 0; i < playField.rightButtonCol.length; i++) {
      if (isInRect(p, playField.rightButtonCol[i])) {
        evt = { kind: "playRight", row: i };
        break;
      }
    }
  }
  if (evt === undefined) {
    for (let r = 0; r < playField.field.length; r++) {
      for (let c = 0; c < playField.field[r].length; c++) {
        if (isInRect(p, playField.field[r][c])) {
          switch (e.button) {
            case 0:
              evt = { kind: "setFour", row: r, col: c };
              break;
            case 2:
              evt = { kind: "setTwo", row: r, col: c };
              break;
            default:
              break;
          }
          break; // for loop
        }
      }
    }
  }
  if (evt !== undefined) {
    evtQueue.push(evt);
  }
};

/*
 * main program
 */
reset(k);
requestAnimationFrame((time) => {
  const lastTime = time;
  requestAnimationFrame((time) => loop(lastTime, time));
});

/*
 * functions
 */
function reset(k: number) {
  field = [];
  playField = {
    topButtonRow: [],
    bottomButtonRow: [],
    leftButtonCol: [],
    rightButtonCol: [],
    field: [],
  };

  for (let i = 0; i < k; i++) {
    field.push([]);
    for (let j = 0; j < k; j++) {
      field[i].push(0);
    }
  }

  let topRowStart: Point = { x: buttonsConfig.vertButtonWidth, y: 0 };
  let bottomRowStart: Point = {
    x: buttonsConfig.vertButtonWidth,
    y:
      buttonsConfig.horzButtonHeigth +
      canvas.height -
      2 * buttonsConfig.horzButtonHeigth,
  };
  let rowStride = (1 / k) * (canvas.width - 2 * buttonsConfig.vertButtonWidth);
  for (let r = 0; r < k; r++) {
    let x = topRowStart.x + r * rowStride;
    let y = topRowStart.y;
    let topButton = {
      x: x,
      y: y,
      w: rowStride,
      h: buttonsConfig.horzButtonHeigth,
    };
    playField.topButtonRow.push(topButton);
    x = bottomRowStart.x + r * rowStride;
    y = bottomRowStart.y;
    let bottomButton = {
      x: x,
      y: y,
      w: rowStride,
      h: buttonsConfig.horzButtonHeigth,
    };
    playField.bottomButtonRow.push(bottomButton);
  }

  let leftButtonColStart: Point = { x: 0, y: buttonsConfig.horzButtonHeigth };
  let rightButtonColStart: Point = {
    x:
      buttonsConfig.vertButtonWidth +
      canvas.width -
      2 * buttonsConfig.vertButtonWidth,
    y: buttonsConfig.horzButtonHeigth,
  };
  let colStride =
    (1 / k) * (canvas.height - 2 * buttonsConfig.horzButtonHeigth);
  for (let c = 0; c < k; c++) {
    let x = leftButtonColStart.x;
    let y = leftButtonColStart.y + c * colStride;
    let leftButton = {
      x: x,
      y: y,
      w: buttonsConfig.vertButtonWidth,
      h: colStride,
    };
    playField.leftButtonCol.push(leftButton);
    x = rightButtonColStart.x;
    y = rightButtonColStart.y + c * colStride;
    let rightButton = {
      x: x,
      y: y,
      w: buttonsConfig.vertButtonWidth,
      h: colStride,
    };
    playField.rightButtonCol.push(rightButton);
  }
  let fieldStart: Point = {
    x: buttonsConfig.vertButtonWidth,
    y: buttonsConfig.horzButtonHeigth,
  };
  let fieldStride: Point = {
    x: (1 / k) * (canvas.width - 2 * buttonsConfig.vertButtonWidth),
    y: (1 / k) * (canvas.height - 2 * buttonsConfig.horzButtonHeigth),
  };
  for (let r = 0; r < k; r++) {
    playField.field.push([]);
    for (let c = 0; c < k; c++) {
      playField.field[r].push({
        x: fieldStart.x + c * fieldStride.x,
        y: fieldStart.y + r * fieldStride.y,
        w: fieldStride.x,
        h: fieldStride.y,
      });
    }
  }
}

function isInRect(p: Point, r: Rect): boolean {
  return r.x <= p.x && p.x <= r.x + r.w && r.y <= p.y && p.y <= r.y + r.h;
}

function update(_dt: number) {
  for (let evt = evtQueue.pop(); evt; evt = evtQueue.pop()) {
    switch (evt.kind) {
      case "setFour":
        if (field[evt.row][evt.col] === 0) {
          field[evt.row][evt.col] = 4;
        }
        break;
      case "setTwo":
        if (field[evt.row][evt.col] === 0) {
          field[evt.row][evt.col] = 2;
        }
        break;
      case "playLeft":
        {
          const row = field[evt.row];
          for (let c = 0; c < row.length; c++) {
            if (row[c] !== 0 && row[c] === row[c + 1]) {
              row[c] += row[c + 1];
              for (let c1 = c + 1; c1 < row.length - 1; c1++) {
                row[c1] = row[c1 + 1];
              }
              row[row.length - 1] = 0;
            }
          }
        }
        break;
      case "playRight":
        {
          const row = field[evt.row];
          for (let c = row.length - 1; c > 0; c--) {
            if (row[c] !== 0 && row[c] === row[c - 1]) {
              row[c] += row[c - 1];
              for (let c1 = c - 1; c1 > 0; c1--) {
                row[c1] = row[c1 - 1];
              }
              row[0] = 0;
            }
          }
        }
        break;
      case "playDown":
        {
          for (let r = field.length - 1; r > 0; r--) {
            if (
              field[r][evt.col] !== 0 &&
              field[r][evt.col] === field[r - 1][evt.col]
            ) {
              field[r][evt.col] += field[r - 1][evt.col];
              for (let r1 = r - 1; r1 > 0; r1--) {
                field[r1][evt.col] = field[r1 - 1][evt.col];
              }
              field[0][evt.col] = 0;
            }
          }
        }
        break;
      case "playUp":
        {
          for (let r = 0; r < field.length; r++) {
            if (
              field[r][evt.col] !== 0 &&
              field[r][evt.col] === field[r + 1][evt.col]
            ) {
              field[r][evt.col] += field[r + 1][evt.col];
              for (let r1 = r + 1; r1 < field.length - 1; r1++) {
                field[r1][evt.col] = field[r1 + 1][evt.col];
              }
              field[field.length - 1][evt.col] = 0;
            }
          }
        }
        break;
      case "restart": {
        k = evt.k;
        reset(k);
      }
    }
  }
}

function render_new() {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  ctx.save();

  ctx.font = "48px courier-new";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "blue";
  ctx.fillStyle = "white";

  ctx.save();
  for (let i = 0; i < playField.topButtonRow.length; i++) {
    const btn = playField.topButtonRow[i];
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

    ctx.strokeStyle = "black";
    let txt = "U";
    const mid: Point = { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 };
    ctx.strokeText(txt, mid.x, mid.y);
  }
  ctx.restore();
  ctx.save();
  for (let i = 0; i < playField.bottomButtonRow.length; i++) {
    const btn = playField.bottomButtonRow[i];
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

    ctx.strokeStyle = "black";
    let txt = "D";
    const mid: Point = { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 };
    ctx.strokeText(txt, mid.x, mid.y);
  }
  ctx.restore();
  ctx.save();
  for (let i = 0; i < playField.leftButtonCol.length; i++) {
    const btn = playField.leftButtonCol[i];
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

    ctx.strokeStyle = "black";
    let txt = "L";
    const mid: Point = { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 };
    ctx.strokeText(txt, mid.x, mid.y);
  }
  ctx.restore();
  ctx.save();
  for (let i = 0; i < playField.rightButtonCol.length; i++) {
    const btn = playField.rightButtonCol[i];
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

    ctx.strokeStyle = "black";
    let txt = "R";
    const mid: Point = { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 };
    ctx.strokeText(txt, mid.x, mid.y);
  }
  ctx.restore();
  ctx.save();

  ctx.fillStyle = "gray";
  for (let r = 0; r < k; r++) {
    for (let c = 0; c < k; c++) {
      const f = playField.field[r][c];
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeStyle = "blue";
      ctx.strokeRect(f.x, f.y, f.w, f.h);

      if (field[r][c]) {
        const mid: Point = { x: f.x + f.w / 2, y: f.y + f.h / 2 };
        ctx.strokeStyle = "white";
        let txt = field[r][c].toString();
        ctx.strokeText(txt, mid.x, mid.y);
      }
    }
  }
  ctx.restore();
}

function loop(lastTime: number, time: number) {
  const dt = time - lastTime;
  const curTime = time;
  update(dt);
  render_new();

  requestAnimationFrame((time) => loop(curTime, time));
}
