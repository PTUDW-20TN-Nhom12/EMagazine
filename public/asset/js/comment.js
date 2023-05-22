function addComment() { 
  // append comment 
  let username = document.getElementById('comment-username').value; 
  let content = document.getElementById('comment-content').value; 

  if (username.length == 0 || content.length == 0) { 
    return; 
  }
  
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let date = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;

  let newElement = document.createElement('div'); 
  newElement.innerHTML = `\
    <div class="ms-4 d-flex flex-row align-items-center">\
      <span class="dot"></span>\
      <div class="ms-3">\
        <p class="text-danger m-0">${username}</p>\
        <p class="m-0">${content}</p>\
      </div>\
      <span class="ms-auto me-3">${date}</span>\
    </div>\
  `;
  newElement.classList.add('mt-3'); 

  console.log(newElement); 

  let commentContainer = document.querySelector('.comment-container'); 
  commentContainer.appendChild(newElement);

  // increase comments count 
  let commentHeader = document.querySelector('.comment-container h2'); 
  let commentHeaderContent = commentHeader.textContent; 
  let commentsCount = 0; 

  for (let i = 0; i < commentHeaderContent.length; ++i) { 
    let x = parseInt(commentHeaderContent[i]);
    if (isNaN(x)) 
      continue; 
    commentsCount = commentsCount * 10 + x; 
    console.log(i, commentsCount); 
  }

  console.log(commentsCount);
  console.log(`Bình luận (${commentsCount + 1})`);

  commentHeader.innerHTML = `Bình luận (${commentsCount + 1})`;

  // delete content inside text area 
  document.getElementById('comment-username').value = ""; 
  document.getElementById('comment-content').value = ""; 
}