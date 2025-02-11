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
      tile.textContent = (index === 0) ? '' : index
      tile.dataset.index = index
      tile.dataset.value = index
      row.appendChild(tile)
    }
    root.appendChild(row)
  }
}

generateTile()