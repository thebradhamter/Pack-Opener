let cards = [];

let stats = JSON.parse(localStorage.getItem("packStats")) || {
  packsOpened: 0,
  rarities: {}
};

function saveStats() {
  localStorage.setItem("packStats", JSON.stringify(stats));
}

function updateStatsDisplay() {
  const statsDiv = document.getElementById("stats");
  let html = `<h3>Packs Opened: ${stats.packsOpened}</h3><ul>`;

  for (let r in stats.rarities) {
    html += `<li>${r}: ${stats.rarities[r]}</li>`;
  }

  html += "</ul>";
  statsDiv.innerHTML = html;
}

fetch("sets/Z-Genesis_Melemele.json")
  .then(res => res.json())
  .then(json => cards = json.data);

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getByRarity(rarity) {
  return cards.filter(c => c.rarity === rarity);
}

function weightedRoll(table) {
  const total = table.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * total;

  for (let entry of table) {
    if (roll < entry.weight) return entry.rarity;
    roll -= entry.weight;
  }
}

function openPack() {
  const pack = document.getElementById("pack");
  pack.innerHTML = "";

  const pulls = [];

  for (let i = 0; i < 7; i++) {
    pulls.push(randomFrom(getByRarity(weightedRoll([
      { rarity: "Common", weight: 4 },
      { rarity: "Uncommon", weight: 3 }
    ]))));
  }

  pulls.push(randomFrom(getByRarity(weightedRoll([
    { rarity: "Common", weight: 33 },
    { rarity: "Uncommon", weight: 133 },
    { rarity: "Illustration Rare", weight: 6.25 },
    { rarity: "Special Illustration Rare", weight: 1.75 },
    { rarity: "Hyper Rare", weight: 1 }
  ]))));

  pulls.push(randomFrom(getByRarity(weightedRoll([
    { rarity: "Common", weight: 85 },
    { rarity: "Uncommon", weight: 232 },
    { rarity: "Illustration Rare", weight: 17 },
    { rarity: "Special Illustration Rare", weight: 3.8 },
    { rarity: "Hyper Rare", weight: 2.2 }
  ]))));

  pulls.push(randomFrom(getByRarity(weightedRoll([
    { rarity: "Rare", weight: 11 },
    { rarity: "Double Rare", weight: 3 },
    { rarity: "Ultra Rare", weight: 1 }
  ]))));

  pulls.forEach((card, index) => {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
  pack.appendChild(div);

  setTimeout(() => {
    div.classList.add("show");
  }, index * 350);
});

}

document.getElementById("openPack").onclick = openPack;

