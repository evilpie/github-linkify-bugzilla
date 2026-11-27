function createBugLink(text, id) {
  let link = document.createElement("a");
  link.href = "https://bugzilla.mozilla.org/show_bug.cgi?id=" + id;
  link.target = "_blank";
  link.classList.add(".bugzilla");
  link.textContent = text;
  // Make link clickable inside another link.
  link.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  return link;
}

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
  let match = /(.*)?([Bb]ug\s+#?(\d{3,}))(.*)?/s.exec(text);
  if (match) {
    let span = document.createElement("span");

    if (match[1]) {
      span.append(match[1])
    }

    span.append(createBugLink(match[2], match[3]));

    if (match[4]) {
      span.append(match[4]);
    }

    element.replaceWith(span);
  }
}

function replaceBugCommitLinks(container) {
  for (let link of container.querySelectorAll("a.commit-link")) {
    let id = link.textContent;
    if (!/^\d{3,}$/.test(id)) {
      continue;
    }

    // GitHub sometimes interprets a bug number as an abbreviated commit hash.
    let preceding = document.createRange();
    preceding.setStart(container, 0);
    preceding.setEndBefore(link);
    if (/\b[Bb]ug\s+#?$/.test(preceding.toString())) {
      link.replaceWith(createBugLink(id, id));
    }
  }
}

{
  function update() {
    let containers = document.querySelectorAll(
      "[class*='prc-Text-Text-'], .react-directory-commit-message"
    );
    for (let container of containers) {
      replaceBugCommitLinks(container);
      replaceBug(container);
    }
  }

  let observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  update();
}

