'use strict';

const COUNT_ROW = 4
const COUNT_COLUMN = 4

const generate = () => {
  const root = document.querySelector('.tile-container')
  for(let i = 0; i < COUNT_ROW; ++i) {
    const row = document.createElement('div')
    row.classList.add('tile-row')
    for(let j = 0; j < COUNT_COLUMN; ++j) {
      const tile = document.createElement('div')
      const index = i * COUNT_ROW + j
      tile.classList.add('tile')
      tile.dataset.index = index
      tile.dataset.value = index
      tile.textContent = (index === 0) ? '' : index
      row.appendChild(tile)
    }
    root.appendChild(row)
  }
}

const swap = (i, j) => {
  const tileI = tiles[i]
  const tileJ = tiles[j]
  if(!tileI || !tileJ) return
  const tmpValue = tileI.dataset.value
  const tmpTextContent = tileI.textContent
  tileI.dataset.value = tileJ.dataset.value
  tileJ.dataset.value = tmpValue
  tileI.textContent = tileJ.textContent
  tileJ.textContent = tmpTextContent
}

const isWhiteTail = i => {
  const tile = tiles[i]
  if(!tile) return
  return (Number(tile.dataset.value) === 0)
}

const indexTop = i => {
  const index = (i - COUNT_COLUMN)
  if(index < 0) return
  return index
}
const indexBottom = i => {
  const index = (i + COUNT_COLUMN)
  if(index < 0) return
  return index
}
const indexLeft = i => {
  const index = (i - 1)
  if(index < 0) return
  return index
}
const indexRight = i => {
  const index = (i + 1)
  if(index < 0) return
  return index
}

const existTop = i => (indexTop(i) >= 0)
const existBottom = i => (indexBottom(i) < COUNT_ROW * COUNT_COLUMN)
const existLeft = i => (i % COUNT_COLUMN !== 0)
const existRight = i => (i % COUNT_COLUMN !== (COUNT_COLUMN - 1))

const existWhiteTileTop = i => isWhiteTail(indexTop(i))
const existWhiteTileBottom = i => isWhiteTail(indexBottom(i))
const existWhiteTileLeft = i => isWhiteTail(indexLeft(i))
const existWhiteTileRight = i => isWhiteTail(indexRight(i))

const canSwapTop = i => (existTop(i) && existWhiteTileTop(i))
const canSwapBottom = i => (existBottom(i) && existWhiteTileBottom(i))
const canSwapLeft = i => (existLeft(i) && existWhiteTileLeft(i))
const canSwapRight = i => (existRight(i) && existWhiteTileRight(i))

const swapTop = i => {
  if(!canSwapTop(i)) return
  swap(i, indexTop(i))
}
const swapBottom = i => {
  if(!canSwapBottom(i)) return
  swap(i, indexBottom(i))
}
const swapLeft = i => {
  if(!canSwapLeft(i)) return
  swap(i, indexLeft(i))
}
const swapRight = i => {
  if(!canSwapRight(i)) return
  swap(i, indexRight(i))
}

const select = (i) => {
  if(canSwapTop(i)) swapTop(i)
  if(canSwapBottom(i)) swapBottom(i)
  if(canSwapLeft(i)) swapLeft(i)
  if(canSwapRight(i)) swapRight(i)
}

const isGameClear = () => {
  return [...tiles].every((tile, i) => (Number(tile.dataset.value) === i))
}

const showGameClear = () => {
  const dom = document.querySelector('.completed')
  dom.classList.add('-show')
}

const checkGameClear = () => {
  if(!isGameClear()) return
  showGameClear()
  removeEventListener()
}

const onClick = (e) => {
  const i = Number(e.target.dataset.index)
  select(i)
  checkGameClear()
}

const addEventListener = () => {
  for(const tile of tiles) {
    tile.addEventListener('click', onClick)
  }
}
const removeEventListener = () => {
  for(const tile of tiles) {
    tile.removeEventListener('click', onClick)
  }
}

const randomize = () => {
  for(let i = 0; i < 1000; ++i) {
    const random = Math.floor(Math.random() * COUNT_ROW * COUNT_COLUMN)
    select(random)
  }
}

generate()
const tiles = document.querySelectorAll('.tile')
addEventListener()
randomize()
checkGameClear()