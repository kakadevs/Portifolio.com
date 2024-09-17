/*==========
This is the script that will be executed on the webpage.
==========*/

/*==========
We define some DOM elements: the settings' part, and the part where the results will be loaded.
==========*/
const settings = document.getElementsByClassName('params')[0];
const results = document.getElementsByClassName('results')[0];

/*==========
A function to add a toggle switch to the settings
==========*/
function addSwitch(label, func) {
  settings.innerHTML += `<label class="switch"><input type="checkbox" checked onchange="${func}"><span></span></label><label>${label}</label><br><br>`;
}

/*==========
A function to open a link in a new tab.
==========*/
function openLink(link) {
  window.open(link);
}

/*==========
The function to show the results of the request.
==========*/
function showResults(obj) {

  // first we remove all in the results' part
  results.innerHTML = '';

  // then, for each of the key (artists, tracks, albums...)
  Object.keys(obj).forEach(i => {

    // for each of the key's value's items
    obj[i].items.forEach(item => {
      if (!item) return;
      
      const img = (i !== 'tracks' ? 
        item.images[0]?.url : 
        item.album.images[0]?.url) || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Music_notation_signature.svg/640px-Music_notation_signature.svg.png'; // we set a default image

      // we had a result
      results.innerHTML += `<div onclick="openLink('${item.external_urls.spotify}')"><img src="${img}"><label>${item.name}</label></div>`;
    });
  });
}

/*==========
The different types of query. There can be many of them at the same time.
==========*/
const items = ["album", "artist", "playlist", "track", "show", "episode"];
let types = items;

/*==========
For each item, we add a toggle switch
==========*/
items.forEach(i => {
  addSwitch(i, `changeItem(event, '${i}')`);
});

/*==========
The function to search the results. It send a request it the keyCode is equal to 13 (the enter key)
==========*/
function search(e) {
  if (e.keyCode === 13) {
    fetch('/api/search?query=' + encodeURIComponent(e.target.value) + '&types=' + types.join(','))
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          results.textContent = res.error;
        } else {
          showResults(res.results);
        }
      })
      .catch((e) => {
        console.log(e);
        alert('An error occured. Please retry again.')
      });
  }
}

/*==========
The function to change the selected items.
==========*/
function changeItem(event, item) {
  if (event.target.checked) {
    types.push(item);
  } else {
    types.splice(types.indexOf(item), 1);
  }
}