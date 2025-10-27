async function loadPage(page) {
  const content = document.getElementById("content");

  if (page === "home") {
    content.innerHTML = `
      <h2>Benvenuto in Project Xbox</h2>
      <p>Un archivio completo di tutte le console Xbox, dalla prima Original fino alle Series.</p>
      <p>Progetto creato da <strong>LukePalmDev</strong> per raccogliere la storia, i modelli e le curiosità del mondo Xbox.</p>
    `;
    return;
  }

  try {
    const res = await fetch(`data/${page}.json`);
    if (!res.ok) throw new Error("File non trovato");
    const data = await res.json();
    renderPage(data);
  } catch (err) {
    content.innerHTML = `<p>Contenuto non disponibile.</p>`;
  }
}

function renderPage(data) {
  const content = document.getElementById("content");
  content.innerHTML = `<h2>${data.title}</h2>` +
    `<div>${data.models.map(m => `
      <div class="card">
        <h3>${m.name}</h3>
        <p><strong>Anno:</strong> ${m.year}</p>
        <p><strong>Descrizione:</strong> ${m.description}</p>
      </div>
    `).join("")}</div>`;
}

function handleNavigation(e) {
  const page = e.target.dataset.page;
  if (!page) return;
  e.preventDefault();
  history.pushState({ page }, "", `?page=${page}`);
  loadPage(page);
}

document.querySelector("nav").addEventListener("click", handleNavigation);

window.addEventListener("popstate", e => {
  const page = (e.state && e.state.page) || "home";
  loadPage(page);
});

const params = new URLSearchParams(window.location.search);
loadPage(params.get("page") || "home");

