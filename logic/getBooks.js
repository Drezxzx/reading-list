let booksInPage = [];
let books = [];
let booksInList=[];
let bfirstime =false;
window.addEventListener('load', function (event) {
  libroslista();

  });
function libroslista(event) {
  console.log("hola");
  fetch('data/books.json')
    .then(response => response.json())
    .then(data => {
      data["library"].forEach(booksdata => {
        const book = booksdata.book;
        booksInPage.push(book);
        books.push(book);
      });
      printBooks();
      getPagesBooks();
      getGenreBooks();
      updateTotalBooksInPage();

      const divImg = document.querySelector(".img");
      divImg.addEventListener('click', function (e) {
        if (e.target.classList.contains("addtolist")) {
          const parentNode = e.target.parentNode;
          const bookTitle = parentNode.querySelector(".name").innerHTML;
          addBooksToList(bookTitle);
        }
      });
    })
    .catch(error => {
      console.error('Error al cargar el archivo JSON: ' + error);
    });
}
function printBooks(typefilter = null, valuetosearch = null) {
  const nodegenere = document.getElementById("genero-select").value;
  const divImg = document.querySelector(".img");
  divImg.innerHTML = "";
  if (typefilter === "genres") {
    booksInPage.forEach(book => {
      if (book.genre === valuetosearch ) {
        console.log(book.genre);
        console.log(valuetosearch);
        appendBookToDiv(book, divImg);
      }
    });
  } else if (typefilter === "pages") {
    booksInPage.forEach(book => {
      const pages = parseInt(book.pages);
      if (pages >= valuetosearch && (book.genre === nodegenere || nodegenere === "todas")) {
        appendBookToDiv(book, divImg);
      }   
    });
  } else {
    booksInPage.forEach(book => {
      updateTotalBooksInPage()
      appendBookToDiv(book, divImg);
    });
  }
  return divImg;
}
function appendBookToDiv(book, divImg) {
  divImg.innerHTML += `
    <div class="divImg">
      <div class="wrapperImg">
        <div class="width100">
          <img src="${book.cover}" alt="Descripción de la imagen">
        </div>
      </div>
      <p class="name">${book.title}</p>
      <button class="addtolist">Agregar a la lista</button>
    </div>
  `;
}
function updateTotalBooksInPage(e) {
  const subtittle = document.querySelector(".subtitulo");
  const tittle= document.querySelector(".titulo")
  subtittle.innerHTML = booksInList.length +" libros en lista de lectura ";
  tittle.innerHTML = booksInPage.length  + " libros disponibles "; 
}

function addBooksToList(nameBook = null) {
  console.log(nameBook);
  const nodewrapperlist = document.querySelector(".wrapperlista");
  booksInPage.forEach((book, index) => {
    if (book.title === nameBook) {
      console.log("hola");
      booksInList.push(book);
      nodewrapperlist.innerHTML = "";
      printBooksFromList();
      booksInPage.splice(index, 1);
      printBooks();
    }
  });
  updateTotalBooksInPage();
}
function addBooksToPage(nameBook = null) {
  const nodewrapperpage = document.querySelector(".img");
  console.log(booksInList);
  booksInList.forEach((book, index) => {
    if (book.title === nameBook) {
      booksInPage.push(book);
      booksInList.splice(index, 1);
      nodewrapperpage.innerHTML = "";
      printBooks();
    }
  });
  updateTotalBooksInPage();
}


let currentPage = 0;
const itemsPerPage = 6;
function printBooksFromList() {
  const nodesectionlist = document.querySelector(".listalectura");
  const nodewrapperlist = document.querySelector(".wrapperlista");
  nodesectionlist.classList.remove("hiddenD");
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const booksToDisplay = booksInList.slice(start, end);
  nodewrapperlist.innerHTML ="";
  booksToDisplay.forEach((book, index) => {
    nodewrapperlist.innerHTML += `
    <div class="book-item">
      <div class="removeButtonContainer">
        <button class="removeFromList">✕</button>
      </div>
      <div class="wrapperImg">
        <div class="width100">
          <img src="${book.cover}" alt="Descripción de la imagen">
        </div>
      </div>
      <p class="nameInlist">${book.title}</p>
    </div>`;
  });  
  nodewrapperlist.innerHTML += `<div class="button-div">
    <button id="button-prev" onclick="prevSlide()">&#60</button>
    <button id="button-next" onclick="nextSlide()">&#62</button>
  </div>`;
  const buttonDelete = document.querySelectorAll(".removeButtonContainer");
  buttonDelete.forEach(button => {
    button.addEventListener('click', function (e) {
      let parentNode = e.target.parentNode;
      let trueDiv =parentNode.parentNode;
      let nombre = trueDiv.querySelector(".nameInlist").innerHTML;
      deleteFromList(nombre, "lista");
      if (booksInList.length === 0) {
        nodesectionlist.classList.add("hiddenD");
      }
    });
  });
  return nodewrapperlist;
}

function nextSlide() {
  if (currentPage < Math.ceil(booksInList.length / itemsPerPage) - 1) {
    currentPage++;
    printBooksFromList(); 
  }
}

function prevSlide() {
  if (currentPage > 0) {
    currentPage--;
    printBooksFromList(); 
  }
}

function deleteFromList(nameBook = null, tipodelista= null) {
  if (tipodelista === "pagina") {
    const bookDivs = document.querySelectorAll(".name");
    bookDivs.forEach(bookDiv => {
      if (bookDiv.innerHTML === nameBook) {
        const bookDivParent = bookDiv.parentNode;
        bookDivParent.remove();
        updateTotalBooksInPage()
      }
    });
  }else if (tipodelista === "lista"){
    addBooksToPage(nameBook)
    booksInList = booksInList.filter(book => book.title !== nameBook);
    const bookDivs = document.querySelectorAll(".nameInlist");
    bookDivs.forEach(bookDiv => {
      if (bookDiv.innerHTML === nameBook) {
        const bookDivParent = bookDiv.parentNode;
        bookDivParent.remove();
        console.log(booksInPage);
      }
    });
  }
}
function getGenreBooks() {
  const genres = new Set();
  const nodeselect = document.getElementById("genero-select");
  console.log(nodeselect);
  books.forEach(book => {
    genres.add(book.genre); 
  });
  genres.forEach(genre => {
    nodeselect.innerHTML += `<option class="select-genres" value="${genre}">${genre}</option>`;
  });
  filterByGenres();
}
let maxpage = 0;
function getPagesBooks() {
  const nodeselectpages = document.getElementById("page");
  const pagesOBJ = new Set();
  books.forEach(book => {
    pagesOBJ.add(book.pages); 
  });
  pagesOBJ.forEach(page => {
    if (page > maxpage) {
      maxpage = page
    }
  });
  nodeselectpages.innerHTML = `<label for="price">filtrar por pagina </label>`;
  nodeselectpages.innerHTML +=` <input
    type="range"
    name="price"
    id="price"
    class = "p"
    min="43"
    max="${maxpage}"
    value="43"/>
    <output class="price-output" for="price">todas</output>
  `
  filterByPages();
}
function filterByGenres(e) {
  const nodeselect = document.getElementById("genero-select");
  const priceOutput = document.querySelector(".price-output")
  nodeselect.addEventListener('change',function () {
    let nodevalue = nodeselect.value;
    console.log(nodeselect.value);
    if (nodevalue === "todas") {
      console.log(nodevalue);
      printBooks(nodevalue);
    }else{
      console.log(nodevalue + "else");
      printBooks("genres",nodevalue);
    }
  })
}
function filterByPages() {
  const priceOutput = document.querySelector(".price-output")
  const nodeinputprice = document.getElementById("price")
      nodeinputprice.addEventListener('input', function () {
            priceOutput.innerHTML = nodeinputprice.value;
            
            printBooks("pages", nodeinputprice.value);
          });
    }
 


