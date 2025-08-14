// todo.js - simple localStorage powered tasks
const TASKS_KEY = 'todoTasks_v1';
let tasks = [];
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('tasks-list');
const showCompleted = document.getElementById('show-completed');
const clearAll = document.getElementById('clear-all');

function save(){ localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }
function load(){ const raw = localStorage.getItem(TASKS_KEY); tasks = raw ? JSON.parse(raw) : []; }

function render(){
  list.innerHTML = '';
  const show = showCompleted.checked;
  tasks.forEach((t, idx)=>{
    if(!show && t.done) return; // hide completed unless checked
    const li = document.createElement('li');
    const left = document.createElement('div'); left.className='left';

    const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = t.done;
    cb.addEventListener('change', ()=>{ tasks[idx].done = cb.checked; save(); render(); });

    const txt = document.createElement('span'); txt.textContent = t.text;
    if(t.done) txt.style.textDecoration='line-through';

    left.appendChild(cb); left.appendChild(txt);

    const actions = document.createElement('div');
    const edit = document.createElement('button'); edit.textContent='Edit'; edit.className='btn small';
    edit.addEventListener('click', ()=>{ const val = prompt('Edit task', t.text); if(val!==null){ tasks[idx].text = val.trim(); save(); render(); }});
    const del = document.createElement('button'); del.textContent='Delete'; del.className='btn small';
    del.addEventListener('click', ()=>{ if(confirm('Delete task?')){ tasks.splice(idx,1); save(); render(); }});

    actions.appendChild(edit); actions.appendChild(del);

    li.appendChild(left); li.appendChild(actions);
    list.appendChild(li);
  });
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  tasks.unshift({text, done:false, created:Date.now()});
  input.value=''; save(); render();
});

showCompleted.addEventListener('change', render);
clearAll.addEventListener('click', ()=>{ if(confirm('Clear all tasks?')){ tasks=[]; save(); render(); }});

load(); render();