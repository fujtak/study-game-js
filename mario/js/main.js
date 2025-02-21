// canvas要素の取得
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

// キーボードの入力状態を記録する配列
let input_key_buffer = new Array();

// キャラクターの画像
let playerImage = null
// キャラクラーの座標
let playerX = 0
let playerY = 300
// y軸の速度
let playerSpeedY = 0
// y軸の加速度
const playerAccelY = 0.5
// ジャンプしたか否かのフラグ値
let isPlayerJump = false
// ブロックの上か否かのフラグ値
let isPlayerOnBlock = true

// ブロック要素の定義
const blocks = [
  { x: 0, y: 332, w: 200, h: 32 },
  { x: 250, y: 332, w: 200, h: 32 },
  { x: 500, y: 332, w: 530, h: 32 }
];
// 地面の画像
let blockImage = null


function init() {

  // キーボードの入力イベントをトリガーに配列のフラグ値を更新させる
  window.addEventListener("keydown", handleKeydown);
  function handleKeydown(e) {
    input_key_buffer[e.keyCode] = true;
  }

  window.addEventListener("keyup", handleKeyup);
  function handleKeyup(e) {
    input_key_buffer[e.keyCode] = false;
  }

  // キャラクター画像初期化
  playerImage = new Image();
  playerImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABsElEQVR42u3dvQ3CMBCAUVcsQMEYFCzBILQsxCSMwjYHZaoYZJ8x4X3iyihI96ooP6VMXrx+M08RAAJAAAgAASAABIA2s2DAAAAAAAAAAAAAAAAAAAAAAACgX8fDPjInbte2edzXp3K8Kz0ACAABIAAEgAAQAAJAAAgAAQAAAAAAAAAAAAAAwOcLTAfw5QEAAAAAAAAAAAAAAAAAAAAAAADmmewLWQAAAAAAAAAAAAAAAAAAAAAA4H6BcUCyz++OEAAEgAAQAAJAAAgAvd/5ErE2tRcx1o6vjQ0AIAAEgAAQAAJAAGjcglun9YMOgAAAAAAAAAAAAAAAAAAAAAAAQL+yL+Rkf/gREAAAAAAAAAAAAAAAAAAAAAAAWCy49vBEMoBmIF4UCQAAAAAAAAAAAAAAAAAAAAAA3QBkL7gZCAAAAAAAAAAAAAAAAAAAAAAAADDshpBfnyIABIAAEAACQAAIgD/qtItomewFAAAAAAAAAAAAAAAAAAAAAAAAAPMAqM3W/x8AAAAAAAAAAAAAAAAAAAAAAADSbwHZ5wcEAAAAAAAAAAAAAAAAAAAAgIEAnrQrn26JvN6oAAAAAElFTkSuQmC";

  // 地面の画像初期化
  blockImage = new Image()
  blockImage.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QC6RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAAAiAAAAZodpAAQAAAABAAAAiAAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAgoAMABAAAAAEAAAAgAAAAAP/AABEIACAAIAMBEQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgICAgIDAgICAwQDAgIDBAUEBAQEBAUGBQUFBQUFBgYHBwgHBwYJCQoKCQkMDAwMDAwMDAwMDAwMDAz/2wBDAQMDAwUEBQkGBgkNCwkLDQ8ODg4ODw8MDAwMDA8PDAwMDAwMDwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/3QAEAAT/2gAMAwEAAhEDEQA/APtxnJB4+lfmh9mV3Y+tUhXI1chqYXJvNJ4NQ0M//9D7abgHPWvzQ+zK0hxzmrSJZCGG7/P+FAh4PzVLKR//0ftg5+bPevzQ+zK8n0qyCv0Y0APU5apkUj//0vts/wAX1r83Psyq/XkUIlkWMtQIVVA/z71Mikf/2Q==";
}


// 画面を更新する関数を定義 (繰り返しここの処理が実行される)
function update() {
  // 画面全体をクリア
  ctx.clearRect(0, 0, 9999, 9999);

  // 左
  if (input_key_buffer[37]) {
    playerX = playerX - 1;
  }
  // 上
  if (input_key_buffer[38]) {
    playerSpeedY = -7;
    isPlayerJump = true;
  }
  // 右
  if (input_key_buffer[39]) {
    playerX = playerX + 1;
  }
  // 下
  if (input_key_buffer[40]) {
    playerY = playerY + 1;
  }

  if (isPlayerJump) {
    // 上下方向は速度分をたす
    playerY += playerSpeedY;
    // 重力加速
    playerSpeedY = playerSpeedY + playerAccelY;
  }

  for(const block of blocks) {
    // ブロックの上にいる場合は何もしない
    if (
      playerX + 32 < block.x ||
      playerX >= block.x + block.w
    ) {
      continue
    }
    console.log('ブロックの上にいます')
    isPlayerOnBlock = true
    break
  }

  if(isPlayerOnBlock) {
    // 地面以下にはいかないように
    if (playerY + 32 > 332) {
      playerY = 332 - 32;
    }
  } else {
    // // 初速0
    playerSpeedY = 0
    // // 重力加速
    playerSpeedY = playerSpeedY + playerAccelY
  }

  // 主人公の画像を表示
  ctx.drawImage(playerImage, playerX, playerY, 32, 32);
  // 地面の画像を表示
  for(const block of blocks) {
    ctx.drawImage(blockImage, block.x, block.y, block.w, block.y);
  }

  // 再描画
  window.requestAnimationFrame(update);
}

// ロード時に画面描画の処理が実行されるようにする
window.addEventListener("load", () => {
  init()
  update()
});