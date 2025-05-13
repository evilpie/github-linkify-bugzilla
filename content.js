function replaceBug(element) {
  // Prevent recursion
  if (element.classList?.contains(".bugzilla")) {
    return;
  }

  for (let child of element.childNodes) {
    replaceBug(child);
  }

  if (element.nodeName != "#text") {
    return;
  }

  let text = element.textContent;
  let match = /(.*)?([Bb]ug\s+#?(\d{3,}))(.*)?/.exec(text);
  if (match) {
    let span = document.createElement("span");

    if (match[1]) {
      span.append(match[1])
    }

    let a = document.createElement("a");
    a.href = "https://bugzilla.mozilla.org/show_bug.cgi?id=" + match[3];
    a.target = "_blank";
    a.classList.add(".bugzilla");
    a.textContent = match[2];
    // Make link clickable inside another link.
    a.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    span.append(a);

    if (match[4]) {
      span.append(match[4]);
    }

    element.replaceWith(span);
  }
}

{
  function update() {
    console.log("update");

    let containers = document.querySelectorAll(".prc-Text-Text-0ima0");
    for (let container of containers) {
      replaceBug(container);
    }
  }

  let observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  update();
}

