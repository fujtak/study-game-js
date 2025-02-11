'use strict';

const rowCount = 4
const colCount = 4

const generateTile = () => {
  const root = document.querySelector('[data-container]')
  for(let i = 0; i < rowCount; ++i) {
    const row = document.createElement('div')
    row.classList.add('row')
    for(let j = 0; j < colCount; ++j) {
      const tile = document.createElement('div')
      const index = i * rowCount + j
      tile.classList.add('tile')
      tile.dataset.tile = true
      tile.dataset.index = index
      tile.dataset.value = index
      tile.textContent = (index === 0) ? '' : index
      row.appendChild(tile)
    }
    root.appendChild(row)
  }
}

const swap = (i, j) => {
  const tiles = document.querySelectorAll('[data-tile]')
  const tileI = tiles[i]
  const tileJ = tiles[j]
  const tmpValue = tileI.dataset.value
  const tmpTextContent = tileI.textContent
  tileI.dataset.value = tileJ.dataset.value
  tileJ.dataset.value = tmpValue
  tileI.textContent = tileJ.textContent
  tileJ.textContent = tmpTextContent
}

generateTile()
swap(0, 6)