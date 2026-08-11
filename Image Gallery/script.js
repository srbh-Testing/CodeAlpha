const photos = [
  { id: 1015, cat: "nature", title: "River Bend, Late Light" },
  { id: 1018, cat: "nature", title: "Pine Ridge Fog" },
  { id: 1043, cat: "nature", title: "Still Water, Cold Front" },
  { id: 1044, cat: "nature", title: "Undergrowth Study" },
  { id: 1039, cat: "nature", title: "Treeline, Blue Hour" },
  { id: 1016, cat: "urban", title: "Concrete Interval" },
  { id: 1048, cat: "urban", title: "Corridor No. 3" },
  { id: 1076, cat: "urban", title: "Facade Grid" },
  { id: 1067, cat: "urban", title: "Stair Section" },
  { id: 1024, cat: "portrait", title: "Field Notes, Subject A" },
  { id: 1025, cat: "portrait", title: "Waiting Room" },
  { id: 1027, cat: "portrait", title: "Backlit, Unposed" },
  { id: 1011, cat: "travel", title: "Coastal Route, Km 42" },
  { id: 1019, cat: "travel", title: "Departure Gate" },
  { id: 1035, cat: "travel", title: "Overland, Dusk" },
  { id: 1049, cat: "travel", title: "Border Crossing" },
];

const categories = ["all", "nature", "urban", "portrait", "travel"];
let activeCat = "all";

const filtersEl = document.getElementById("filters");
const gridEl = document.getElementById("grid");
const visibleCountEl = document.getElementById("visibleCount");

function frameCode(i) {
  return String(i + 1).padStart(2, "0") + "A";
}

function imgUrl(id, w, h) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

function buildFilters() {
  filtersEl.innerHTML = "";
  categories.forEach((cat, i) => {
    if (i > 0) {
      const dot = document.createElement("span");
      dot.className = "sprocket";
      filtersEl.appendChild(dot);
    }
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat === activeCat ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      activeCat = cat;
      buildFilters();
      renderGrid();
    });
    filtersEl.appendChild(btn);
  });
}

function visiblePhotos() {
  return activeCat === "all" ? photos : photos.filter(p => p.cat === activeCat);
}

function renderGrid() {
  gridEl.innerHTML = "";
  const list = visiblePhotos();
  visibleCountEl.textContent = list.length;

  list.forEach((p, i) => {
    const globalIndex = photos.indexOf(p);
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.tabIndex = 0;
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", `Open ${p.title}`);
    frame.innerHTML = `
      <span class="tag-no">${frameCode(i)}</span>
      <img loading="lazy" src="${imgUrl(p.id, 500, 620)}" alt="${p.title}">
      <div class="frame-caption">
        <span class="title">${p.title}</span>
        <span class="cat">${p.cat}</span>
      </div>
    `;
    const open = () => openLightbox(globalIndex, list, i);
    frame.addEventListener("click", open);
    frame.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    gridEl.appendChild(frame);
  });
}

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbCount = document.getElementById("lbCount");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let activeSet = [];
let activeSetPos = 0;

function openLightbox(globalIndex, set, posInSet) {
  activeSet = set;
  activeSetPos = posInSet;
  renderLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderLightbox() {
  const p = activeSet[activeSetPos];
  lbImg.src = imgUrl(p.id, 1200, 900);
  lbImg.alt = p.title;
  lbTitle.textContent = p.title;
  lbCount.textContent = `${String(activeSetPos + 1).padStart(2, "0")} / ${String(activeSet.length).padStart(2, "0")}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function step(delta) {
  activeSetPos = (activeSetPos + delta + activeSet.length) % activeSet.length;
  renderLightbox();
}

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => step(-1));
lbNext.addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

buildFilters();
renderGrid();