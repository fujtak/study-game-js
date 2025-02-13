'use strict';

const COUNT_ROW = 4
const COUNT_COLUMN = 4

const generate = () => {
  const root = document.querySelector('.container')
  for(let i = 0; i < COUNT_ROW; ++i) {
    const row = document.createElement('div')
    row.classList.add('row')
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

const isTarget = i => {
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

const existTargetTop = i => isTarget(indexTop(i))
const existTargetBottom = i => isTarget(indexBottom(i))
const existTargetLeft = i => isTarget(indexLeft(i))
const existTargetRight = i => isTarget(indexRight(i))

const canSwapTop = i => (existTop(i) && existTargetTop(i))
const canSwapBottom = i => (existBottom(i) && existTargetBottom(i))
const canSwapLeft = i => (existLeft(i) && existTargetLeft(i))
const canSwapRight = i => (existRight(i) && existTargetRight(i))

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

const onClick = (e) => {
  const i = Number(e.target.dataset.index)
  if(canSwapTop(i)) swapTop(i)
  if(canSwapBottom(i)) swapBottom(i)
  if(canSwapLeft(i)) swapLeft(i)
  if(canSwapRight(i)) swapRight(i)
}

const addEventListener = () => {
  for(const tile of tiles) {
    tile.addEventListener('click', onClick)
  }
}

const randomize = () => {
  for(let i = 0; i < 1000; ++i) {
    const random = Math.floor(Math.random() * COUNT_ROW * COUNT_COLUMN)
    tiles[random].click()
  }
}

generate()
const tiles = document.querySelectorAll('.tile')
addEventListener()
randomize()