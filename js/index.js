console.log("JavaScript file loaded");
document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/books")
      .then(response => response.json())
      .then(books => {
        const list = document.getElementById("list");
        books.forEach(book => {
          const li = document.createElement("li");
          li.textContent = book.title;
          li.addEventListener("click", () => showBookDetails(book));
          list.appendChild(li);
        });
      });
  
    function showBookDetails(book) {
      const showPanel = document.getElementById("show-panel");
      const imgUrl = book.img_url || "path/to/default-image.jpg"; 
  
      showPanel.innerHTML = `
        <h3>${book.title}</h3>
        <img src="${imgUrl}" alt="${book.title}">
        <p>${book.description}</p>
        <h4>Users who like this book:</h4>
        <ul id="users-list">
          ${book.users.map(user => `<li>${user.username}</li>`).join('')}
        </ul>
        <button id="like-btn">${hasUserLiked(book) ? "UNLIKE" : "LIKE"}</button>
      `;
      document.getElementById("like-btn").addEventListener("click", () => toggleLike(book));
    }
  
    function hasUserLiked(book) {
      const currentUser = { id: 1, username: "pouros" };
      return book.users.some(user => user.id === currentUser.id);
    }
  
    function toggleLike(book) {
      const currentUser = { id: 1, username: "pouros" };
      const userIndex = book.users.findIndex(user => user.id === currentUser.id);
  
      if (userIndex === -1) {
        book.users.push(currentUser); 
      } else {
        book.users.splice(userIndex, 1); 
      }
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: book.users })
      })
      .then(response => response.json())
      .then(updatedBook => {
        showBookDetails(updatedBook); 
      });
    }
  });
  