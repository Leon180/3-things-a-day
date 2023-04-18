const selectOptions = [
  {
    selectName: 'year',
    defaultName: 'Year',
    selectClass: 'form-select',
    start: 2020,
    end: 2060
  },
  {
    selectName: 'month',
    defaultName: 'Month',
    selectClass: 'form-select',
    start: 1,
    end: 12
  },
  {
    selectName: 'day',
    defaultName: 'Day',
    selectClass: 'form-select',
    start: 1,
    end: 31
  }
]

const filterForm = document.querySelector('.filter-form') // filter
renderFilter(filterForm, selectOptions, "input-group", "Filter")
// cards will be select by filterForm condition and then group by batchGroupCondition, then push to batchs.
// batchs will be render by renderBatchCards class, which will render batchLength cards in one batch. and then render next batch when the last batch is in the view.
const accessToken = getCookie('accessToken') // get accessToken from cookie
const apiLink = '/api/date' // api link
const fetchMethod = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
}
const batchGroupCondition = 'id'
const batchLength = 5
const showCardsArea = document.querySelector('.show-cards') // cards show area
const errorMessageArea = document.querySelector('.error-message') // error message area
const batchLastObserverClass = '.cards-group:last-child' // batch observer class
getCardsBatch(batchLength, filterForm, apiLink, fetchMethod, batchGroupCondition, showCardsArea, errorMessageArea, batchLastObserverClass)

document.querySelector('.filter-form .btn').addEventListener('click', () => { getCardsBatch(batchLength, filterForm, apiLink, fetchMethod, batchGroupCondition, showCardsArea, errorMessageArea, batchLastObserverClass) })



// Filter
function renderFilter(ele, options, containerClass, buttonName) {
  let navHtml = `<div class="${containerClass}">`
  options.forEach((option) => {
    navHtml += buildSelectHTML(option)
  })
  navHtml += `
  <button class="btn btn-outline-secondary" type="button">${buttonName}</button>
  </div >`
  ele.innerHTML = navHtml
}
function buildSelectHTML(option, selectedOption) {
  let selecthtml = `<select class=${option.selectClass} name=${option.selectName}>`
  if (option.defaultName) selecthtml += `<option value="" selected>${option.defaultName}</option>`
  for (let i = option.start; i <= option.end; i++) {
    selecthtml += `<option value="${i}" ${i === selectedOption ? 'selected' : ''}>${i}</option>`
  }
  selecthtml += `</select>`
  return selecthtml
}

// Cards Batch
async function getCardsBatch(batchLength, formEle, apiLink, fetchMethod, batchGroupCondition, showCardsArea, errorMessageArea, batchLastObserverClass) {
  if (!formEle) return showErrorMessage(errorMessageArea, 'No form element found')
  showCardsArea.innerHTML = ''
  const formData = new FormData(formEle)
  let link = apiLink + '?' // api link
  for (const pair of formData.entries()) { link += `${pair[0]}=${pair[1]}&` }
  link = link.slice(0, -1)
  // link = `/api/date?year=2023&month=4` // test
  const returnData = await fetch(link, fetchMethod)
  const returnJson = await returnData.json()
  if (returnData.status !== 200) return showErrorMessage(errorMessageArea, returnJson.message)
  const batchs = batchPushCards(groupCards(returnJson.data, batchGroupCondition), batchLength)
  if (batchs.length === 0) showErrorMessage(errorMessageArea, 'No result found')
  const rbc = new renderBatchCards(batchs, showCardsArea, batchLastObserverClass)
  rbc.renderBatch()
  rbc.createObserver()
}

// grouping cards with condition
function groupCards(data, groupCondition) {
  const group = []
  let copyData = [...data]
  while (copyData.length > 0) {
    let groupData = copyData.filter((item) => item[groupCondition] === copyData[0][groupCondition])
    copyData = copyData.filter((item) => item[groupCondition] !== copyData[0][groupCondition])
    group.push(groupData)
  }
  return group
}

function batchPushCards(groupData, batchLength) {
  const batchAmount = Math.ceil(groupData.length / batchLength)
  const batchs = []
  for (let i = 0; i < batchAmount; i++) {
    const aBatch = []
    const startIndex = batchLength * i
    const endIndex = i === (batchAmount - 1) ? groupData.length : (batchLength * i + batchLength)
    for (let j = startIndex; j < endIndex; j += 1) {
      aBatch.push(groupData[j])
    }
    batchs.push(aBatch)
  }
  return batchs
}

class renderBatchCards {
  constructor(batchs, pEle, batchLastObserverClass) {
    this.batchs = batchs
    this.pEle = pEle
    this.batchLastObserverClass = batchLastObserverClass
    this.index = 0
  }
  renderBatch() {
    if (this.index >= this.batchs.length) return
    let cardGroupHtml = ''
    this.batchs[this.index].forEach(group => {
      cardGroupHtml += `
    <div class="cards-group">
      <div class="row mt-4 mb-3 fs-5">
        ${group[0].year}-${group[0].month}-${group[0].day}
      </div>
      <div class="row row-cols-1 row-cols-md-3 gx-3 gy-2">
    `
      group.forEach(date => {
        cardGroupHtml += `
        <div class="col">
          <div class="card h-100">
            <div class="card-body">
              <div class="row justify-content-start">
                <div class="col-4 text-center">${date.Cards.type}</div>
              </div>
              <div class="text-center">
                <div class="card-title col fs-3">${date.Cards.title}</div>
              </div>
              <div class="text-center d-flex align-items-center justify-content-between">
                <div class="col">${date.Cards.start}</div>
                <div class="col">~</div>
                <div class="col">${date.Cards.end}</div>
              </div>
              <p class="card-text mt-2 px-1">${date.Cards.record}</p>
            </div>
          </div>
        </div>
      `
      })
      cardGroupHtml += `</div></div>`
    })
    this.pEle.innerHTML += cardGroupHtml
    this.index += 1
  }
  createObserver() {
    const lastGroupObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      if (entries[0].isIntersecting) {
        this.renderBatch()
        lastGroupObserver.unobserve(entries[0].target)
        lastGroupObserver.observe(document.querySelector(this.batchLastObserverClass))
      }
    })
    if (document.querySelector(this.batchLastObserverClass)) lastGroupObserver.observe(document.querySelector(this.batchLastObserverClass))
  }
}


