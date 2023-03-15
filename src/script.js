//API
async function getRepo(name) {
  console.log(name);
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${name}&page=1&per_page=10`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.github+json",
      },
    }
  );
  if (!response.ok) {
    return Promise.reject(
      `<h2 class='errorResult'>An error occured: ${response.status}</h2>`
    );
  }

  return await response.json();
}

//HELPER FUNCTIONS
function getElement(elem) {
  return document.querySelector(`.${elem}`);
}

function createElement(elem) {
  return document.createElement(elem);
}

function clearHtml(elem) {
  return (elem.innerHTML = "");
}

const setClass = (elem, name) => {
  return elem.classList.add(name);
};

// CONSTRUCTOR
class RepoItem {
  constructor(id, full_name, avatar_url, html_url, language, description) {
    this.id = id;
    this.full_name = full_name;
    this.avatar_url = avatar_url;
    this.html_url = html_url;
    this.language = language;
    this.description = description;
  }

  introduce() {
    const newItem = createElement("div");
    const img = createElement("img");
    const info = createElement("div");
    const a = createElement("a");
    const language = createElement("p");
    const description = createElement("p");

    setClass(newItem, "repoItem");
    setClass(img, "repoItem__img");
    setClass(info, "repoItem__info");
    setClass(a, "repoItem__link");
    setClass(language, "repoItem__language");
    setClass(description, "repoItem__description");

    newItem.append(img, info);
    info.append(a, language, description);

    img.setAttribute(
      "src",
      this.avatar_url ||
        "https://cdn-icons-png.flaticon.com/512/4992/4992199.png"
    );
    a.setAttribute("href", `${this.html_url}`);
    a.setAttribute("target", "_blank");
    a.innerHTML = this.full_name;
    language.innerHTML = `Language: ${this.language || "___"}`;
    description.innerHTML = `Description: ${this.description || "___"}`;

    return newItem;
  }
}

// ELEMENTS
let formSearch = getElement("formSearch");
let inputSearch = getElement("inputSearch");
let buttonSearch = getElement("buttonSearch");
let resultList = getElement("resultList");
let repoList = [];

// LOADER
let loader = createElement("img");
loader.setAttribute(
  "src",
  "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
);
loader.classList.add("loader");

// EMPTY RESULT
let emptyResult = createElement("h2");
emptyResult.innerHTML = "Ничего не найдено";
emptyResult.classList.add("emptyResult");

// MAIN CLICK BUTTON
buttonSearch.addEventListener("click", (e) => {
  clearHtml(resultList);
  let str = inputSearch.value.trim();
  if (str.length < 3) {
    e.preventDefault()
    resultList.innerHTML = "<h2 class='emptyResult'>Как минимум 3 символа</h2>"
    return (inputSearch.value = "")
  } else if (str !== "") {
    resultList.append(loader);
    getRepo(inputSearch.value)
      .then((data) => {
        clearHtml(resultList);
        if (data.items.length === 0) {
          resultList.append(emptyResult);
          return (inputSearch.value = "");
        }
        data.items.map((item) => {
          let newItem = new RepoItem(
            item.id,
            item.full_name,
            item.owner.avatar_url,
            item.html_url,
            item.language,
            item.description
          );
          resultList.append(newItem.introduce());
          return (inputSearch.value = "");
        });
      })
      .catch((error) => {
        resultList.innerHTML = error;
      });
  } else {
    inputSearch.value = "";
  }
});
