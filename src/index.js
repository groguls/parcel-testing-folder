// Є Discovery API (https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2)
// API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
// Потрібно відрендерити колекцію  івентів і реалізувати пагінацію
// за допомогою бібліотеки tui - pagination(https://www.npmjs.com/package/tui-pagination)

import { pagination } from './pagination';

const ROOT_URL = 'https://app.ticketmaster.com/discovery/v2/';
const API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
const page = pagination.getCurrentPage();
const list = document.querySelector('.list');
const form = document.querySelector('.form');
let keyword = '';
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');

form.addEventListener('submit', onSubmit);
list.addEventListener('click', onClick);
backdrop.addEventListener('click', onClose);

function onSubmit(e) {
  e.preventDefault();

  keyword = e.target.elements.input.value;
  console.log(keyword);

  getFirstPageIvent(page, keyword);
}

function onClick(e) {
  const id = e.target.id;
  console.log(id);
  backdrop.classList.remove('is-hidden');
  getOneEvent(id);
}

function onClose() {
  backdrop.classList.add('is-hidden');
}

function fetchData(page, keyword) {
  // https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey={apikey}
  return fetch(
    `${ROOT_URL}events.json?apikey=${API_KEY}&page=${page}&keyword=${keyword}`
  ).then(resp => {
    console.log(resp);
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}
fetchData(page, keyword);

function fetchDataId(id) {
  return fetch(`${ROOT_URL}events.json?apikey=${API_KEY}&id=${id}`)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      console.log(resp);
      return resp.json();
    })
    .catch(error => console.log(error));
}

// fetchDataId('Z7r9jZ1Ad4yFy');

function getFirstPageIvent(page, keyword) {
  fetchData(page, keyword)
    .then(data => {
      console.log(data);
      pagination.reset(data.page.totalElements);
      renderEvents(data._embedded.events);
    })
    .catch(error => console.log(error));
}

getFirstPageIvent(page, keyword);

function renderEvents(data) {
  console.log(data);
  const murkup = data
    .map(({ name, id }) => `<li id="${id}"><p id="${id}">${name}</p></li></li>`)
    .join('');
  list.innerHTML = murkup;
}

function getEvents(page, keyword) {
  fetchData(page, keyword)
    .then(data => {
      console.log(data);
      renderEvents(data._embedded.events);
    })
    .catch(error => console.log(error));
}

pagination.on('afterMove', event => {
  const currentPage = event.page;
  console.log(currentPage);
  getEvents(currentPage, keyword);
});

function getOneEvent(id) {
  fetchDataId(id)
    .then(data => {
      console.log(data);
      renderOneEvent(data._embedded.events);
    })
    .catch();
}
// getOneEvent('Z7r9jZ1Ad4yFy');

function renderOneEvent(data) {
  const markup = `<img src="${data[0].images[0].url}" width="240",height="240"/>
    <p>${data[0].name}</p>`;
  modal.innerHTML = markup;
}
