function showLoading() {
  const div = document.createElement("div");
  div.classList.add("loading", "centralize");
  const span = document.createElement("span");
  span.innerText = "Loading...";

  div.appendChild(span);
  document.body.appendChild(div);
}

function hideLoading() {
  const loadings = document.getElementsByClassName("loading");
  if (loadings.length) {
    loadings[0].remove();
  }
}
