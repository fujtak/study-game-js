const canvas = document.getElementById("maincanvas")
const ctx = canvas.getContext("2d")
const canvasHeight = canvas.height

let input_key_buffer = new Array()

const playerWidth = 32
const playerHeight = 32
const playerYInit = canvasHeight - playerHeight
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

  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight)

  window.requestAnimationFrame(update)
}

window.addEventListener("load", () => {
  init()
  update()
})