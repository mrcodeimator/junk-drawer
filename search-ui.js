function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fuzzyScore(query, candidate) {
  const q = normalize(query);
  const c = normalize(candidate);
  if (!q) return 0;
  if (c === q) return 1000;
  if (c.startsWith(q)) return 800 - (c.length - q.length);
  if (c.includes(q)) return 600 - c.indexOf(q);

  let qi = 0;
  let score = 0;
  let last = -1;
  for (let i = 0; i < c.length && qi < q.length; i += 1) {
    if (c[i] === q[qi]) {
      score += last === i - 1 ? 6 : 2;
      last = i;
      qi += 1;
    }
  }
  return qi === q.length ? score : -1;
}

function filterCatalog(query) {
  const q = query.trim();
  if (!q) return loadRecents();

  return CATALOG.map((item) => {
    const nameScore = fuzzyScore(q, item.name);
    const categoryScore = fuzzyScore(q, CATEGORY_LABELS[item.category] || item.category);
    const score = Math.max(nameScore, categoryScore * 0.5);
    return { item, score };
  })
    .filter((row) => row.score >= 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .map((row) => row.item);
}

function createSearchController(dialog) {
  const input = dialog.querySelector("#search-input");
  const list = dialog.querySelector("#results");
  const meta = dialog.querySelector("#results-meta");
  const errorBanner = dialog.querySelector("#error-banner");
  const shell = dialog.querySelector("#search-shell");

  let items = [];
  let activeIndex = 0;
  let running = false;

  function showError(message) {
    if (!message) {
      errorBanner.hidden = true;
      errorBanner.textContent = "";
      return;
    }
    errorBanner.hidden = false;
    errorBanner.textContent = message;
  }

  function render() {
    list.innerHTML = "";
    const query = input.value.trim();

    if (!items.length) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = query ? "No matches" : "No recent items yet — start typing";
      list.appendChild(empty);
      meta.textContent = "";
      return;
    }

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      if (index === activeIndex) li.classList.add("active");

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = item.name;

      const category = document.createElement("span");
      category.className = "category";
      category.textContent = CATEGORY_LABELS[item.category] || item.category;

      li.appendChild(name);
      li.appendChild(category);
      li.addEventListener("mouseenter", () => {
        activeIndex = index;
        updateActive();
      });
      li.addEventListener("click", () => {
        activeIndex = index;
        runActive();
      });
      list.appendChild(li);
    });

    meta.textContent = query
      ? `${items.length} result${items.length === 1 ? "" : "s"}`
      : `Recent · ${items.length}`;
  }

  function updateActive() {
    const rows = list.querySelectorAll("li:not(.empty)");
    rows.forEach((row, index) => {
      row.classList.toggle("active", index === activeIndex);
    });
    const active = rows[activeIndex];
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({ block: "nearest" });
    }
  }

  function refresh() {
    items = filterCatalog(input.value);
    activeIndex = items.length ? 0 : -1;
    render();
  }

  async function runActive() {
    if (running || activeIndex < 0 || !items[activeIndex]) return;
    const entry = items[activeIndex];
    running = true;
    showError("");
    try {
      dialog.close();
      await invokeEntry(entry);
      pushRecent(entry);
    } catch (err) {
      const message =
        err && err.code === "NO_DOCUMENT"
          ? "Open a document first."
          : (err && err.message) || "Could not run that command.";
      // Re-open so the user can try again or pick something else
      open();
      showError(message);
    } finally {
      running = false;
    }
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!items.length) return;
      activeIndex = (activeIndex + 1) % items.length;
      updateActive();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!items.length) return;
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActive();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      runActive();
    }
  }

  function onDialogClick(event) {
    // Click outside the shell (on dialog chrome / backdrop area) dismisses
    if (event.target === dialog) {
      dialog.close();
    }
  }

  function open() {
    showError("");
    input.value = "";
    refresh();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else if (typeof dialog.show === "function") {
      dialog.show();
    }
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }

  input.addEventListener("input", () => {
    showError("");
    refresh();
  });
  dialog.addEventListener("keydown", onKeyDown);
  dialog.addEventListener("click", onDialogClick);
  shell.addEventListener("click", (event) => event.stopPropagation());

  return { open };
}
