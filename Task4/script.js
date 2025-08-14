// simple interactions for portfolio page
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.querySelector('.hero .btn');
  if(btn) btn.addEventListener('click', e=>{
    e.preventDefault();
    document.getElementById('projects').scrollIntoView({behavior:'smooth'});
  });
});