const deleteBlog = (btn)=>{
    const blogCard = btn.closest('.blog-card');
    const blogId = btn.parentNode.querySelector('[name=blogId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    console.log(blogId);
fetch('/delete-blog/' + blogId, {
  method: 'DELETE',
  headers: {
    'Accept': 'application/json',
    'x-csrf-token': csrfToken
  }
})
.then(async res => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Delete failed');
  }
  return data;
})
.then(data => {
  console.log(data);
  if (blogCard) {
    blogCard.remove();
  }
})
.catch(err => {
  console.error(err);
});
};
