// Form Validation
document.getElementById('contactForm').addEventListener('submit', function(event) {
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  if (name.trim() === '' || email.trim() === '') {
    alert('All fields are required!');
    event.preventDefault();
  } else if (!email.includes('@')) {
    alert('Please enter a valid email!');
    event.preventDefault();
  }else {
    event.preventDefault(); // Prevent actual form submission
    alert('Thank you, ' + name + '! Your message has been received.');
    document.getElementById('contactForm').reset(); // Clear form
  }
});

// To-Do List Function
// To-Do List Function with Success Popup
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value;

  if (taskText.trim() === '') {
    alert('Please enter a task!');
    return;
  }

  const li = document.createElement('li');
  li.textContent = taskText;

  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.onclick = () => li.remove();

  li.appendChild(delBtn);
  document.getElementById('taskList').appendChild(li);

  taskInput.value = '';

  // ✅ Success message
  alert('Task added successfully!');
}

