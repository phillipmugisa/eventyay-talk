document
  .querySelectorAll("#cfp-option-table .require input")
  .forEach(element => {
    element.addEventListener("click", ev => {
      if (ev.target.checked) {
        ev.target.parentElement.parentElement.parentElement.parentElement.querySelector(
          ".request input"
        ).checked = true
      }
    })
  })

const sortEntries = (parentElem) => {
  // using selection sort as default
  for (let i = 0; i < parentElem.querySelectorAll("tr").length; i++) {
    let lowest = parentElem.querySelectorAll("tr")[i]

    for (let j = i + 1; j < parentElem.querySelectorAll("tr").length; j++) {
      let next = parentElem.querySelectorAll("tr")[j]
      // compare position values
      // values must be numbers
      // if the next click has a lowest value, it becomes the lowest
      if (!isNaN(parseInt(lowest.getAttribute("data-form-position"))) && !isNaN(parseInt(next.getAttribute("data-form-position"))) && parseInt(lowest.getAttribute("data-form-position")) > parseInt(next.getAttribute("data-form-position"))) {
        
        lowest = next;
      }
    }

    // insert the lowest child at the start.
    // lowestClone = lowest.cloneNode(true)
    // lowest.remove()
    parentElem.querySelectorAll("tr")[i].before(lowest)
  }
}

const makeCfpContentSwappable = () => {
  document.querySelectorAll("fieldset table tbody").forEach(parentElem => {
    const firstItem = parentElem.querySelector("tr:first-of-type");
    
    // if firstItem has form position > -1, sort the fields based on saved field positions
    if (firstItem.getAttribute("data-form-position") != null && parseInt(firstItem.getAttribute("data-form-position")) > -1) {
      sortEntries(parentElem)
    }

    parentElem.querySelectorAll("tr").forEach((row, i) => {

      // if any attritube has form position = -1, assign positions based on default position
      if (row.getAttribute("data-form-position") != null && parseInt(row.getAttribute("data-form-position")) < 0) {
        row.setAttribute("data-form-position", i) // position starts for 0
      }

      // add moving icon if not exist
      if (row.querySelector("td.swap-area") == null || row.querySelector("td.swap-area") == undefined) {
        const td = document.createElement("td");
        td.className = 'swap-area'
        const icon = document.createElement("span");
        icon.className = "btn btn-sm btn-outline-info";
        td.appendChild(icon)
        row.appendChild(td);
      }

      const td = row.querySelector("td.swap-area")
      const oldIcon = td.querySelector('span')

      // Clone the icon to remove existing event listeners
      const icon = oldIcon.cloneNode(true);
      oldIcon.replaceWith(icon);

      // the first item can be moved down
      if (row == firstItem) {
        icon.innerHTML = `<i class="fa fa-arrow-down"></i>`;
        icon.setAttribute("title", `{% translate "Move down" %}`);
        icon.addEventListener("click", e => {
          e.preventDefault()
          let rowPosition = parseInt(row.getAttribute("data-form-position"))
          row.setAttribute("data-form-position", rowPosition + 1)
          row.nextElementSibling.setAttribute("data-form-position", rowPosition)
          row.nextElementSibling.after(row)
          makeCfpContentSwappable()
        })
      } else {
        icon.innerHTML = `<i class="fa fa-arrow-up"></i>`;
        icon.setAttribute("title", `{% translate "Move up" %}`);
        icon.addEventListener("click", e => {
          e.preventDefault()
          let rowPosition = parseInt(row.getAttribute("data-form-position"))
          row.setAttribute("data-form-position", rowPosition - 1)
          row.previousElementSibling.setAttribute("data-form-position", rowPosition)
          row.previousElementSibling.before(row)
          makeCfpContentSwappable()
        })
      }

      // adding hidden form to submit form position to backend
      let fieldPositionTracker = row.querySelector("div.fieldPositionTracker")
      if (fieldPositionTracker == undefined || fieldPositionTracker == undefined == null) {
        fieldPositionTracker = document.createElement("div")
        td.appendChild(fieldPositionTracker)
      }
      fieldPositionTracker.className = "fieldPositionTracker"
      // fieldPositionTracker.style.display = "none"
      fieldPositionTracker.innerHTML = `<input type="number" name="fieldPosition-${row.getAttribute("data-field-name")}" value="${row.getAttribute("data-form-position")}">`
    });

  })
}

makeCfpContentSwappable()