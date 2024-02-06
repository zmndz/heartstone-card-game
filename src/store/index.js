import { defineStore } from 'pinia'
import axios from 'axios'

const cardsStore = defineStore('digimons', {
  state: () => ({
    allCards: null,
  }),
  getters: {
    getAllCards(state) {
      return state.allCards
    },
  },
  actions: {
    async fetchAllCards() {
      const settings = {
        async: true,
        crossDomain: true,
        url: `${import.meta.env.VITE_BASE_URL_CARDS}/cards/factions/alliance`,
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': `${import.meta.env.VITE_RAPIDAPI_KEY}`,
          'x-rapidapi-host': `${import.meta.env.VITE_RAPIDAPI_HOST}`,
        },
      }

      try {
        const cachedCharacters =
          JSON.parse(localStorage.getItem('hearthstone')) || null
        console.log('cachedCharacters: ', cachedCharacters)
        if (!cachedCharacters) {
          const data = await axios(settings)
          const characters = []
          data?.data.map((item) => {
            if (item.cardSet !== 'Mercenaries' && item.attack && item.img) {
              characters.push(item)
            }
          })
          this.allCards = characters
          localStorage.setItem('hearthstone', JSON.stringify(this.allCards))
        } else {
          this.allCards = cachedCharacters
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})

export default cardsStore
