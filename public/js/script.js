function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
  
    if (sectionId === 'users') fetchUsers();
    else if (sectionId === 'keys') fetchKeys();
  }
  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#keys') {
      showSection('keys');
    }
  });
  
  function showform(){
    let show = document.querySelector('.overlay')
    show.style.display = 'block'
  }
  function hideform(){
    let hide = document.querySelector('.overlay')
    hide.style.display = 'none'
  }
  async function fetchUsers() {
    const res = await fetch('/admin/users');
    const users = await res.json();
    const list = document.getElementById('userList');
    list.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `Username: ${user.username}, HWID: ${user.hwid}`;
      list.appendChild(li);
    });
  }
  
  async function fetchKeys() {
    const res = await fetch('/admin/keys');
    const keys = await res.json();
    const list = document.getElementById('keyList');
    list.innerHTML = '';
    keys.forEach(k => {
      const li = document.createElement('li');
      li.textContent = `Key: ${k.key}, Used: ${k.used}, Expiry: ${new Date(k.expiry).toLocaleDateString()}`;
      list.appendChild(li);
    });
  }
  
  async function generateKey() {
    const expiryDate = document.getElementById('expiryDate').value;
    if (!expiryDate) return alert("Select expiry date");
  
    const res = await fetch('/admin/generate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiry: expiryDate })
    });
  
    const data = await res.json();
    alert("Key generated: " + data.key);
    fetchKeys();
  }
  
  function deleteUser(id) {
    fetch(`/admin/user/${id}`, {
      method: 'DELETE'
    }).then(res => location.reload());
  }
  
  function editUser(id, currentUsername, currentExpiry) {
    const username = prompt("Enter new username:", currentUsername);
    const expiry = prompt("Enter new expiry (DD-MM-YYYY):", currentExpiry);
    if (!username || !expiry) return alert("Both fields required");
  
    fetch(`/admin/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, expiry })
    }).then(res => location.reload());
  }
  
  function deleteKey(id) {
    fetch(`/admin/key/${id}`, {
      method: 'DELETE'
    }).then(res => location.reload());
  }
  