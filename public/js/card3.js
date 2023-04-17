const cardContainer = document.querySelector(".card-container");
console.log(cardContainer);
const accessToken = getCookie('accessToken');
const types = ["book", "sport", "relax"]

todayCard().then((cards) => {
  let cardsHTML = "";
  if (cards.length > 0) cards.forEach((card) => {
    cardsHTML += `
    <div class="col">
      <div class="card">
        <div class="card-body">
          <form id="card" class="form-row mx-2" action="/" method="POST">
            <div class="row g-3 mt-1 mb-3">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" name="title" class="form-control" id="floatingInput" placeholder="Title" value=${card.title}>
                  <label for="floatingInput">Title</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <select name="type" class="form-select" id="floatingSelectGrid"
                    aria-label="Floating label select example">
                    <option value=${types[0]} ${card.type === types[0] ? "selected" : ''}>Book</option>
                    <option value=${types[1]} ${card.type === types[1] ? "selected" : ''}>Sport</option>
                    <option value=${types[2]} ${card.type === types[2] ? "selected" : ''}>Relax</option>
                  </select>
                  <label for="floatingSelectGrid">Type</label>
                </div>
              </div>
            </div>
            <div class="row d-flex justify-content-between mb-3">
              <div class="col-md">
                <input type="time" name="start" style="width:100%;" value=${card.start}>
              </div>
              ~
              <div class="col-md">
                <input type="time" name="end" style="width:100%;" value=${card.end}>
              </div>
            </div>
            <div class="form-floating mb-4">
              <textarea name="record" class="form-control" placeholder="record here" id="floatingTextarea" style="min-height:23vh;">${card.record}</textarea>
              <label for="floatingTextarea">Record</label>
            </div>
            <div class="d-flex align-items-center justify-content-end mb-3">
              <button type="button" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `
  })
  const cardHTML = `
    <div class="col">
      <div class="card">
        <div class="card-body">
          <form id="card" class="form-row mx-2" action="/" method="POST">
            <div class="row g-3 mt-1 mb-3">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" name="title" class="form-control" id="floatingInput" placeholder="Title">
                  <label for="floatingInput">Title</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <select name="type" class="form-select" id="floatingSelectGrid"
                    aria-label="Floating label select example">
                    <option value="book">Book</option>
                    <option value="sport">Sport</option>
                    <option value="relax">Relax</option>
                  </select>
                  <label for="floatingSelectGrid">Type</label>
                </div>
              </div>
            </div>
            <div class="row d-flex justify-content-between mb-3">
              <div class="col-md">
                <input type="time" name="start" style="width:100%;">
              </div>
              ~
              <div class="col-md">
                <input type="time" name="end" style="width:100%;">
              </div>
            </div>
            <div class="form-floating mb-4">
              <textarea name="record" class="form-control" placeholder="record here" id="floatingTextarea"></textarea>
              <label for="floatingTextarea">Record</label>
            </div>
            <div class="d-flex align-items-center justify-content-end mb-3">
              <button type="button" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `
  cardsHTML += cardHTML.repeat(3 - cards.length)
  cardContainer.innerHTML = cardsHTML
})

async function todayCard() {
  const returnData = await fetch('/api/date', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
  const returnJson = await returnData.json()
  if (returnData.status === 200) {
    const cards = []
    for (let i = 0; i < returnJson.data.length; i++) {
      cards.push(returnJson.data[i].Cards)
    }
    return cards
  }
  return []
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}