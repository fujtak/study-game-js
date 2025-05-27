'use strict'

const NUMBER_MAX = 20

const generateNumbers = () => {
  const numbers = []
  for(let i = 0; i < NUMBER_MAX; ++i) {
    for(let j = 0; j < 2; ++j) {
      numbers.push(i + 1)
    }
  }
  return numbers
}



const generateDOM = (numbers) => {
  const root = document.querySelector('.card-container')
  for(const number of numbers) {
    const card = document.createElement('div')
    card.classList.add('card')
    card.textContent = number
    root.appendChild(card)
  }
}

const numbers = generateNumbers()
const numbersShuffled = 
generateDOM(numbers)