const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");

searchForm.addEventListener("submit", searchReddit);

function searchReddit(e) {
  e.preventDefault();
  const searchTerm = searchInput.value;
  const sortBy = document.querySelector('input[type="radio"]:checked').value;

  if (searchTerm === "") {
    message.innerHTML = "Please add a search term";
    message.style.color = "red";
    setTimeout(() => message.remove(), 2000);
  } else {
    search(searchTerm, sortBy).then(results => {
      let output = '<div class="card-column">';
      results.forEach(post => {
        //check for image
        let image = post.preview
          ? post.preview.images[0].source.url
          : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
        output += `<div class="card">
                    <img class="img-top" src="${image}" alt="reddit Image">
                    <div class="card-body">
                      <h5>${truncateText(post.title, 100)}</h5> 
                      <p>${truncateText(post.selftext, 100)}</p>
                      <a href="${
                        post.url
                      }" target="_blank" class="readMore">Read More</a>
                      <hr>
                    </div>
                   </div>`;
      });
      output += "</div>";
      document.getElementById("results").innerHTML = output;
    });
  }

  searchInput.value = "";
}

function search(searchTerm, sortBy) {
  return fetch(
    `https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}`
  )
    .then(res => res.json())
    .then(data => data.data.children.map(data => data.data))
    .catch(err => console.log(err));
}

function truncateText(text, limit) {
  const short = text.indexOf(" ", limit);
  if (short == -1) return text;
  return text.substring(0, short);
}
