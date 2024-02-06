<template>
  <div class="justify-center w-full p-10">
    <h1 class="text-4xl mb-10">Hearthstone</h1>
    <h2 class="text-3xl mb-10">Scores: {{ yourScore }} - {{ cpuScore }}</h2>
    <h2 v-show="isGameFinished" class="text-3xl mb-10">
      <span v-if="isGameTie" class="text-yellow-500">It's a Tie!</span>
      <span v-else-if="areYouWinner" class="text-green-500">You Win!</span>
      <span v-else class="text-red-500">You Lose!</span>
    </h2>
    <div class="w-full flex justify-between mb-8 min-h-[421px]">
      <div class="flex flex-col justify-between items-center flex-1">
        <h2 class="text-xl font-medium">You</h2>
        <div
          v-if="!yourCards?.length"
          class="flex justify-center items-center w-full h-full"
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-20 w-20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              data-darkreader-inline-stroke=""
              style="--darkreader-inline-stroke: currentColor"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              data-darkreader-inline-fill=""
              style="--darkreader-inline-fill: currentColor"
            ></path>
          </svg>
        </div>
        <div
          v-else
          class="flex flex-col justify-between md:flex-row h-full w-full"
        >
          <div
            v-for="(card, index) in yourCards"
            :key="card.cardId"
            class="flex flex-col flex-1 m-4"
          >
            <div>
              <h3 class="my-0.5 text-xl font-semibold">
                Attack: {{ card.attack }}
              </h3>
            </div>

            <div class="relative mb-4 h-full w-full flex-1">
              <img
                :src="card.imgGold || card.img"
                alt=""
                class="pick"
                :class="{
                  'pick-up': isTurnToFight[index],
                  'grayscale pick-down': yourLooserCards[index],
                  'pick-tie sepia': tieCards[index],
                  'blur-[2px]': isGameFinished && !areYouWinner && !isGameTie,
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="cpuCards?.length"
        class="max-w-[32px] lg:max-w-[100px] flex items-center justify-center mx-4 md:mx-10"
      >
        <img src="../assets/vs.png" alt="" />
      </div>

      <div class="flex flex-col justify-between items-center flex-1">
        <h2 class="text-xl font-medium">CPU</h2>
        <div
          v-if="!cpuCards?.length"
          class="flex justify-center items-center w-full h-full"
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-20 w-20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              data-darkreader-inline-stroke=""
              style="--darkreader-inline-stroke: currentColor"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              data-darkreader-inline-fill=""
              style="--darkreader-inline-fill: currentColor"
            ></path>
          </svg>
        </div>
        <div
          v-else
          class="flex flex-col justify-between md:flex-row h-full w-full"
        >
          <div
            v-for="(card, index) in cpuCards"
            :key="card.cardId"
            class="flex flex-col flex-1 m-4"
          >
            <div class="h-[28px]">
              <Transition name="fade" mode="out-in">
                <h3 v-if="isGameStarted" class="my-0.5 text-xl font-semibold">
                  Attack: {{ card.attack }}
                </h3>
              </Transition>
            </div>

            <div class="relative mb-4 h-full w-full flex-1">
              <Transition name="flip" mode="out-in">
                <img
                  v-if="isTurnToFlip[index]"
                  :src="card.imgGold || card.img"
                  alt=""
                  class="absolute w-full pick"
                  :class="{
                    'pick-up': isCpuTurnToFight[index],
                    'grayscale pick-down': cpuLooserCards[index],
                    'pick-tie sepia': tieCards[index],
                    'blur-[2px]': isGameFinished && areYouWinner && !isGameTie,
                  }"
                />
                <img
                  v-else
                  src="../assets/cardback.png"
                  alt=""
                  class="absolute w-full"
                />
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <button
        v-if="!isGameStarted"
        type="button"
        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        @click="handleShuffle()"
      >
        Change your hand
      </button>
      <button
        v-if="!isGameStarted"
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        @click="handleFight()"
      >
        Fight!
      </button>
      <button
        v-if="isGameFinished"
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        @click="resetGame()"
      >
        Play again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cardsStore from '../store'

const cardStore = cardsStore()
const cards = ref(null)
const yourCards = ref(null)
const cpuCards = ref(null)
const isTurnToFlip = ref([])
const isTurnToFight = ref([])
const isCpuTurnToFight = ref([])
const yourLooserCards = ref([])
const cpuLooserCards = ref([])
const tieCards = ref([])
const yourScore = ref(0)
const cpuScore = ref(0)

const isGameStarted = ref(false)
const isGameFinished = ref(false)
const isGameTie = ref(false)
const areYouWinner = ref(false)

const choseRandomCards = (cardsList) => {
  const randomCards = []
  const cardsAmount = 3
  for (let i = 1; i <= cardsAmount; i += 1) {
    const randomIndex = Math.floor(Math.random() * cardsList.length)
    randomCards.push(cardsList[randomIndex])
  }
  return randomCards
}

const initiateCpuCardsStates = () => {
  cpuCards.value.forEach((item, index) => {
    isTurnToFlip.value[index] = false
    isTurnToFight.value[index] = false
    isCpuTurnToFight.value[index] = false
    yourLooserCards.value[index] = false
    cpuLooserCards.value[index] = false
    tieCards.value[index] = false
  })
}

onMounted(async () => {
  await cardStore.fetchAllCards()
  cards.value = cardStore.allCards
  yourCards.value = choseRandomCards(cards.value)
  cpuCards.value = choseRandomCards(cards.value)
  initiateCpuCardsStates()
})

const handleShuffle = () => {
  yourCards.value = []
  setTimeout(() => {
    yourCards.value = choseRandomCards(cards.value)
    cpuCards.value = choseRandomCards(cards.value)
  }, 200)
}

const resetGame = () => {
  isTurnToFlip.value = []
  isTurnToFight.value = []
  isCpuTurnToFight.value = []
  yourLooserCards.value = []
  cpuLooserCards.value = []
  tieCards.value = []
  isGameStarted.value = false
  isGameFinished.value = false
  isGameTie.value = false
  areYouWinner.value = false
  yourScore.value = 0
  cpuScore.value = 0

  handleShuffle()
}

const calculateGameResult = () => {
  if (yourScore.value === cpuScore.value) {
    isGameTie.value = true
  } else if (yourScore.value > cpuScore.value) {
    areYouWinner.value = true
  } else {
    areYouWinner.value = false
  }
  isGameFinished.value = true
}

const setLooserCards = (player, cardIndex) => {
  if (player === 'CPU') {
    cpuLooserCards.value[cardIndex] = true
  }
  if (player === 'YOU') {
    yourLooserCards.value[cardIndex] = true
  }
  if (player === 'TIE') {
    tieCards.value[cardIndex] = true
  }
}

const setScores = (cardIndex) => {
  return new Promise((resolve, reject) => {
    const yourCurrentCardScore = yourCards.value[cardIndex].attack
    const cpuCurrentCardScore = cpuCards.value[cardIndex].attack
    if (yourCurrentCardScore > cpuCurrentCardScore) {
      yourScore.value = yourScore.value + 1
      setLooserCards('CPU', cardIndex)
    } else if (yourCurrentCardScore < cpuCurrentCardScore) {
      cpuScore.value = cpuScore.value + 1
      setLooserCards('YOU', cardIndex)
    } else if (yourCurrentCardScore === cpuCurrentCardScore) {
      setLooserCards('TIE', cardIndex)
    }

    if (cardIndex === cpuCards.value.length - 1) {
      calculateGameResult()
    }
    resolve()
  })
}
const pickCard = () => {
  cpuCards.value.forEach(async (item, index) => {
    setTimeout(
      async () => {
        isTurnToFight.value[index] = true
        isCpuTurnToFight.value[index] = true
        await setScores(index)
      },
      (index + 1) * 1000,
    )
  })
}

const flipCards = (cardIndex) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isTurnToFlip.value[cardIndex] = true
      if (cardIndex === cpuCards.value.length - 1) {
        pickCard()
        resolve()
      }
    }, cardIndex * 500)
  })
}

const handleFight = () => {
  isGameStarted.value = !isGameStarted.value

  cpuCards.value.forEach(async (item, index) => {
    await flipCards(index)
  })
}
</script>

<style scoped>
.flip-enter-active,
.flip-leave-active {
  transition: all 0.4s ease-in;
}

.flip-enter-from {
  transform: rotateY(-90deg);
}

.flip-leave-to {
  transform: rotateY(90deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pick {
  transition: all 0.4s ease-out;
}
.pick-up {
  transform: scale(1.1);
}
.pick-down {
  transform: scale(0.8);
}
.pick-tie {
  transform: scale(1);
}
</style>
