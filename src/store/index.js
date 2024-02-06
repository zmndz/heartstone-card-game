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
      const heartstoneAPI = 'https://omgvamp-hearthstone-v1.p.rapidapi.com'
      const rapidapiKey = "d3cace0953msha451c129f4178c0p191a0ejsn09a308a42bd2"
      const reapidapiHost ="omgvamp-hearthstone-v1.p.rapidapi.com"
      const settings = {
        async: true,
        crossDomain: true,
        url: `${heartstoneAPI}/cards/factions/alliance`,
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidapiKey,
          'x-rapidapi-host': reapidapiHost,
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
