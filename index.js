// Constants
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2609-Keagen";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// State
const state = {
  parties: [],
  selectedParty: null,
};

// State-changing functions

// Updates state, then rerenders so the UI always matches state
function setState(newState) {
  Object.assign(state, newState);
  render();
}

// Fetch the array of parties and update state
async function getParties() {
  try {
    const response = await fetch(API);
    const json = await response.json();

    setState({ parties: json.data ?? json });
  } catch (error) {
    console.error(error);
    setState({ parties: [] });
  }
}

// Fetch a single party by id and update state
async function getParty(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const json = await response.json();

    setState({ selectedParty: json.data ?? json });
  } catch (error) {
    console.error(error);
    setState({ selectedParty: null });
  }
}

// Components (each returns an HTML string)

function PartyListItem(party) {
  return `<li data-id="${party.id}">${party.name}</li>`;
}

function PartyList() {
  if (state.parties.length === 0) {
    return `<p>No parties found.</p>`;
  }

  return `
    <h2>Upcoming Parties</h2>
    <ul>${state.parties.map(PartyListItem).join("")}</ul>
  `;
}

function PartyDetails() {
  const party = state.selectedParty;

  if (!party) {
    return `
      <h2>Party Details</h2>
      <p>Please select a party to see its details.</p>
    `;
  }

  return `
    <h2>Party Details</h2>
    <h3>${party.name}</h3>
    <p><strong>ID:</strong> ${party.id}</p>
    <p><strong>Date:</strong> ${new Date(party.date).toLocaleDateString()}</p>
    <p><strong>Location:</strong> ${party.location}</p>
    <p><strong>Description:</strong> ${party.description}</p>
  `;
}

function App() {
  return `
    <h1>Party Planner</h1>
    <section id="party-list">${PartyList()}</section>
    <section id="party-details">${PartyDetails()}</section>
  `;
}

// Render (runs every time state changes)
function render() {
  try {
    const app = document.querySelector("#app");
    app.innerHTML = App();

    app.querySelectorAll("li[data-id]").forEach((item) => {
      item.addEventListener("click", () => getParty(item.dataset.id));
    });
  } catch (error) {
    console.error(error);
  }
}

// Start the app
async function init() {
  render(); //
  await getParties(); // fetch, update state, and rerender
}

init();
