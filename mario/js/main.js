const canvas = document.getElementById("maincanvas")
const ctx = canvas.getContext("2d")
const canvasWidth = canvas.width
const canvasHeight = canvas.height

let input_key_buffer = new Array()

const groundWidth = canvasWidth
const groundHeight = 30
const groundX = 0
const groundY = canvasHeight - groundHeight
let groundImage = null

const playerWidth = 32
const playerHeight = 32
const playerYInit = groundY - playerHeight
const playerAccelY = 0.5
let playerImage = null
let playerX = 0
let playerY = playerYInit
let playerSpeedY = 0
let isPlayerJump = false

function init() {
  window.addEventListener("keydown", handleKeydown)
  function handleKeydown(e) {
    input_key_buffer[e.keyCode] = true
  }
  window.addEventListener("keyup", handleKeyup)
  function handleKeyup(e) {
    input_key_buffer[e.keyCode] = false
  }

  groundImage = new Image();
  groundImage.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QC6RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAAAiAAAAZodpAAQAAAABAAAAiAAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAgoAMABAAAAAEAAAAgAAAAAP/AABEIACAAIAMBEQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgICAgIDAgICAwQDAgIDBAUEBAQEBAUGBQUFBQUFBgYHBwgHBwYJCQoKCQkMDAwMDAwMDAwMDAwMDAz/2wBDAQMDAwUEBQkGBgkNCwkLDQ8ODg4ODw8MDAwMDA8PDAwMDAwMDwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/3QAEAAT/2gAMAwEAAhEDEQA/APtxnJB4+lfmh9mV3Y+tUhXI1chqYXJvNJ4NQ0M//9D7abgHPWvzQ+zK0hxzmrSJZCGG7/P+FAh4PzVLKR//0ftg5+bPevzQ+zK8n0qyCv0Y0APU5apkUj//0vts/wAX1r83Psyq/XkUIlkWMtQIVVA/z71Mikf/2Q==";

  playerImage = new Image()
  playerImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABsElEQVR42u3dvQ3CMBCAUVcsQMEYFCzBILQsxCSMwjYHZaoYZJ8x4X3iyihI96ooP6VMXrx+M08RAAJAAAgAASAABIA2s2DAAAAAAAAAAAAAAAAAAAAAAACgX8fDPjInbte2edzXp3K8Kz0ACAABIAAEgAAQAAJAAAgAAQAAAAAAAAAAAAAAwOcLTAfw5QEAAAAAAAAAAAAAAAAAAAAAAADmmewLWQAAAAAAAAAAAAAAAAAAAAAA4H6BcUCyz++OEAAEgAAQAAJAAAgAvd/5ErE2tRcx1o6vjQ0AIAAEgAAQAAJAAGjcglun9YMOgAAAAAAAAAAAAAAAAAAAAAAAQL+yL+Rkf/gREAAAAAAAAAAAAAAAAAAAAAAAWCy49vBEMoBmIF4UCQAAAAAAAAAAAAAAAAAAAAAA3QBkL7gZCAAAAAAAAAAAAAAAAAAAAAAAADDshpBfnyIABIAAEAACQAAIgD/qtItomewFAAAAAAAAAAAAAAAAAAAAAAAAAPMAqM3W/x8AAAAAAAAAAAAAAAAAAAAAAADSbwHZ5wcEAAAAAAAAAAAAAAAAAAAAgIEAnrQrn26JvN6oAAAAAElFTkSuQmC"
}

function update() {
  ctx.clearRect(0, 0, 9999, 9999)

  // 左
  if (input_key_buffer[37]) {
    playerX = playerX - 2
  }
  // 上
  if (input_key_buffer[38]) {
    playerSpeedY = -6
    isPlayerJump = true
  }
  // 右
  if (input_key_buffer[39]) {
    playerX = playerX + 2
  }

  if(isPlayerJump) {
    playerSpeedY += playerAccelY
  }

  playerY += playerSpeedY

  if(playerY > playerYInit) {
    playerSpeedY = 0
    playerY = playerYInit
    isPlayerJump = false
  }

  ctx.drawImage(groundImage, groundX, groundY, groundWidth, groundHeight);
  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight)

  window.requestAnimationFrame(update)
}

window.addEventListener("load", () => {
  init()
  update()
})