/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/
// student data field
let currentSearchData = data;

// == display ==
// function to display search bar
const showSearchBar = () => {
  const header = document.querySelector('.header');
  // construct search bar html
  const searchBar = `
      <label for="search" class="student-search">
        <input id="search" placeholder="Search by name...">
        <button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>
      </label>`;
  header.insertAdjacentHTML('beforeend', searchBar);
};

// function to display data on page
const showPage = (list, page) => {
  const studentUL = document.querySelector('.student-list');
  const itemsPerPage = 9;
  const startIndex = (page * itemsPerPage) - itemsPerPage;
  const endIndex = page * itemsPerPage;

  studentUL.innerHTML = '';  // select .student-list & clear it

  // loop student list & construct html of students for selected page
  for(let i = 0; i < list.length; i++) {
    if(i >= startIndex && i < endIndex) {
      const student = `
        <li class="student-item cf">
          <div class="student-details">
            <img class="avatar" src=${list[i].picture.medium} alt="Profile Picture">
            <h3>${list[i].name.first} ${list[i].name.last}</h3>
            <span class="email">${list[i].email}</span>
          </div>
          <div class="joined-details">
            <span class="date">Joined ${list[i].registered.date}</span>
          </div>
        </li>`;
        studentUL.insertAdjacentHTML('beforeend', student);
    }
  }
};

// function that appends page buttons depending on size of list 
const buttonUL = document.querySelector('.link-list'); // global scope ref for eventlistener
const addPagination = list => {
  buttonUL.innerHTML = ''; // clear ul innerhtml
  const itemsPerPage = 9;
  const totalPages = Math.ceil(list.length/itemsPerPage); // ceil to avoid round-down

  // loop totalPages and create page buttons
  for(let i = 0; i < totalPages; i++) {
    const pageButton = `
      <li>
        <button type="button">${i + 1}</button>
      </li>`;
    buttonUL.insertAdjacentHTML('beforeend', pageButton);
  }
  // check if exists & set first button to active
  const firstButton = buttonUL.querySelector('button');
  if(firstButton) firstButton.className = 'active';
};

// function to update page
const updatePage = (list, page) => {
  showPage(list, page);
  addPagination(list);
}

// == pagination ==
// page button event listener
buttonUL.addEventListener('click', (e) => {
  if(e.target.tagName === 'BUTTON') {
    const button = e.target;
    const pageClicked = parseInt(button.textContent);
    // clear .active from prev button and assign clicked button className to active
    buttonUL.querySelector('.active').className = '';
    buttonUL.getElementsByTagName('BUTTON')[pageClicked-1].className = 'active';
    showPage(currentSearchData, pageClicked);

  }
});

// == search bar ==
showSearchBar();
const searchBar = document.querySelector('.student-search');
// click event listener
searchBar.addEventListener('click', e => {
  const input = document.getElementById('search');
  // when user clicks button, target can either be button or the img nested inside
  const clickedElement = e.target;
  if(clickedElement.tagName === 'BUTTON' || clickedElement.tagName === 'IMG') {
    displayUserSearch(input.value);
  }
});

// keyup event listener
searchBar.addEventListener('keyup', e => {
  const input = e.target;
  displayUserSearch(input.value);
});

// function to display user student name search
const displayUserSearch = userSearch => {
  // if usersearch isnt empty, filter data array otherwise display original data
  if(userSearch) {
    currentSearchData = filterNames(userSearch);
    verifySearchFound(currentSearchData);
    updatePage(currentSearchData, 1);
  } else {
    currentSearchData = data;
    updatePage(data, 1);
  }
};

// function to return filtered users by name
const filterNames = userCharInput => {
  return data.filter(student => {
    // lowercase and match students first & last names to user input
    const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
    const userSearch = userCharInput.toLowerCase();
    return fullName.match(userSearch);
  });
};

// function to check search list and insert/remove 'no results found' 
const verifySearchFound = list => {
  // references to dom elements
  const studentNotFoundElement = document.querySelector('.student-not-found');
  const pageDiv = document.querySelector('.page');

  // list empty && 'no result found' element doesn't exist => create html 
  if(list.length === 0 && studentNotFoundElement === null) {
    const p = `<p class="student-not-found">No results found</p>`
    pageDiv.insertAdjacentHTML('beforeend', p);
  } 
  // list not empty && 'no result found' element exist => remove html
  if(list.length >= 1 && studentNotFoundElement !== null) {
    pageDiv.removeChild(studentNotFoundElement);
  }
};

// call page && addpagination function with data and 1 as arguments
updatePage(data, 1);
