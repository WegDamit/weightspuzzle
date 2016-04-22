var tabLinks = [];
var contentDivs = {};

/**
 * [WeightsUlId description]
 * @type {String}
 */
const WeightsUlId = 'listofweights';
/**
 * [StoreItemIndex description]
 * @type {String}
 */
const StoreItemIndex = "weightslist";
/**
 * [weights description]
 * @type {Array}
 */
var weights = [];

// Demo weights...
weights = [25, 20, 10, 10, 5, 5, 2.5, 1.25, 0.5, 0.5];
var handleWeight = 15;

updateWeightsList();

/**
 ** Manage weights stuff
 **/

function storeWeightsList() {
  localStorage.setItem(StoreItemIndex, JSON.stringify(weights));
}

function retrieveWeightsList() {
  weights = JSON.parse(localStorage.getItem(StoreItemIndex));
  updateWeightsList();
}

function removeWeight(w) {
  // var id = this.getAttribute('name');
  var id = this.dataset.index;
  weights.splice(id, 1);
  updateWeightsList();
}

function makeWeightList(array) {
  var list = document.createElement('div');
  list.id = WeightsUlId;
  list.className = "outerDiv";
  for (var i = 0, w; w = array[i]; i++) {
    var item = document.createElement('div');
    item.className = "weightListItem";

    var outer = document.createElement("div");
    outer.name = "weight" + w;
    outer.className = "outerDiv";
    // item.appendChild(outer);

    var btn = document.createElement("div");
    btn.name = "removeWeight" + w;
    btn.className = "removeWeightButton";
    btn.addEventListener("click", removeWeight);
    btn.dataset.index = i;
    // btn.appendChild(document.createTextNode("x"));

    var div = document.createElement("div");
    var c = "weight" + w;
    div.className = "square " + c;
    div.appendChild(btn);
    div.appendChild(document.createTextNode(w));
    item.appendChild(div);

    list.appendChild(item);
  }
  return list;
}

function updateWeightsList() {
  weights = weights.sort(function(a, b) {
    return b - a
  });
  weightsList = document.getElementById(WeightsUlId);
  weightsList.parentNode.replaceChild(makeWeightList(weights), weightsList);
}

/** 
 ** Tab stuff
 **/
function init() {

  // Grab the tab links and content divs from the page
  var tabListItems = document.getElementById('tablist').childNodes;
  for (var i = 0, item; item = tabListItems[i]; i++) {
    if (item.nodeName == "LI") {
      var tabLink = item.firstChild;
      var id = getTabId(tabLink.getAttribute('href'));
      tabLinks[id] = tabLink;
      contentDivs[id] = document.getElementById(id);
    }
  }

  var i = 0;
  for (var id in tabLinks) {
    tabLinks[id].onclick = showTab;
    tabLinks[id].onfocus = function() {
      this.blur()
    };
    if (i == 1) tabLinks[id].parentNode.className = 'active';
    i++;
  }

  // Hide all content divs except the first
  var i = 0;
  for (var id in contentDivs) {
    if (i != 0) {
      contentDivs[id].className = 'hide';
      tabLinks[id].parentNode.className = '';
    }
    i++;
  }
}

function getTabId(url) {
  var hashPos = url.lastIndexOf('#');
  return url.substring(hashPos + 1);
}

/**
 * switch tabs
 */
function showTab() {
  var selectedId = getTabId(this.getAttribute('href'));
  for (var id in contentDivs) {
    if (id == selectedId) {
      console.log("ein " + id);
      tabLinks[id].parentNode.className = 'active';
      contentDivs[id].className = '';
    } else {
      console.log("aus " + id);
      tabLinks[id].parentNode.className = '';
      contentDivs[id].className = 'hide';
    }
  }
  return false;
}

/**
 **  Weight code.
 **/

/**
 * @return {[type]} [description]
 */
function clearUseList() {
  weightsList = document.getElementById("solved");
  while (weightsList.firstChild) {
    weightsList.removeChild(weightsList.firstChild);
  }
}

function storeWeightsList() {
  localStorage.setItem(StoreItemIndex, JSON.stringify(weights));
}

function retrieveWeightsList() {
  weights = JSON.parse(localStorage.getItem(StoreItemIndex));
  updateWeightsList();
}

function makePuzzleError() {
  clearUseList();
  weightsList = document.getElementById("solved");

  var div = document.createElement("div");
  div.id = "errorMsg";
  div.className = "square"
  div.innerHTML = "Geht nicht.";
  weightsList.appendChild(div);
}

function makePuzzleList(w) {
  clearUseList();

  weightsList = document.getElementById("solved");

  var list = [];
  var div = document.createElement("div");
  div.id = "handle";
  div.className = "square"
  div.innerHTML = handleWeight;
  weightsList.appendChild(div);
  var sum = 0;
  for (var i = 0, item; item = w[i]; i++) {
    sum += parseFloat(item);
    var div = document.createElement("div");
    var c = "weight" + item;
    div.className = "square " + c;
    div.innerHTML = item;
    list.push(div);
    weightsList.appendChild(div);
  }

  var div = document.createElement("div");
  div.className = "square";
  div.id = "sum";
  div.innerHTML = sum;
  weightsList.appendChild(div);

  list.push(div);
  weightsList.appendChild(list);
}

function updateWeightsList() {
  weights = weights.sort(function(a, b) {
    return b - a
  });
  weightsList = document.getElementById(WeightsUlId);
  weightsList.parentNode.replaceChild(makeWeightList(weights), weightsList);
}

function addWeight(e) {
  bla = document.getElementById("newWeight").value;
  v = parseFloat(bla, 10);
  if (!isNaN(v)) {
    weights.push(v);
    updateWeightsList();
  }
  return false;
}

function puzzle() {
  clearUseList();
  bla = document.getElementById("wantedWeight").value;
  handleWeight = document.getElementById("handleWeight").value;

  v = parseFloat(bla, 10);
  if (!isNaN(v)) {
    sum = (v - handleWeight) / 2;
    console.log("suche : " + sum);
    var x = mtgs(weights, sum);
    if (typeof x == 'undefined' || x.length == 0) {
      makePuzzleError();
    }
    var w = [];
    for (var i = 0; i < x.length; i++) {
      w.push(weights[x[i]]);
    }

    makePuzzleList(w);
  }
  return false;
}

// w: array of weights
// c: sum of weights 
function mtgs(w, c) {
  var n = w.length;

  // console.log("w : " + w);
  // console.log("c = " + c);

  // Zwischensumme
  var zg = 0;
  // Liste der Elemente um auf zg zu kommen
  var X = [];
  for (i = 0; i < n; i++) {
    // console.log("i = " + i);
    // Untermenge die jetzt geprüft wird
    var Y = [];
    // Testwert der summe
    var d = c;
    for (j = i; j < n; j++) {
      // console.log(" j = " + j);
      // console.log(" d = " + d);
      // console.log(" w = " + w[j]);
      if (w[j] <= d) {
        d = d - w[j];
        Y.push(j);
        // console.log("  Y  : " + Y);
      }
    }
    // console.log("d = " + d );
    if ((c - d) > zg) {
      zg = c - d;
      X = Y
      if (zg == c)
        return X
    }
    // console.log("zg = " + zg );
  }
}

init();