const KEY='helpdesk_no_chartjs';

document.addEventListener('DOMContentLoaded',()=>{
  seed();
  bindNav();
  btnAdd.onclick=showModal;
  navigate('dashboard');
});

function seed(){
  if(!localStorage.getItem(KEY)){
    localStorage.setItem(KEY,JSON.stringify([
      {id:1,title:'AC not working',email:'nikita@gmail.com',status:'Pending'},
      {id:2,title:'Printer jam',email:'cbsingh@gmal.com',status:'In-progress'},
      {id:3,title:'Broken chair',email:'nikita@gmail.com',status:'Completed'}
    ]));
  }
}

function getTickets(){return JSON.parse(localStorage.getItem(KEY));}
function saveTickets(t){localStorage.setItem(KEY,JSON.stringify(t));}

function bindNav(){
  document.querySelectorAll('.nav').forEach(n=>{
    n.onclick=()=>{
      document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));
      n.classList.add('active');
      navigate(n.dataset.view);
    }
  });
}

function navigate(view){
  pageTitle.textContent=view.charAt(0).toUpperCase()+view.slice(1);
  view==='dashboard'?renderDashboard():renderTickets();
}

function renderDashboard(){
  const t=getTickets();
  const c={Pending:0,'In-progress':0,Completed:0};
  t.forEach(x=>c[x.status]++);
  pageContent.innerHTML=`
    <div class="grid">
      <div class="card stat pending"><h2>${c.Pending}</h2><p>Pending</p></div>
      <div class="card stat progress"><h2>${c['In-progress']}</h2><p>In-progress</p></div>
      <div class="card stat done"><h2>${c.Completed}</h2><p>Completed</p></div>
      <div class="card"><h2>${t.length}</h2><p>Total Tickets</p></div>
    </div>
    <div class="card" style="margin-top:20px">
      <h3>Recent Activity</h3>
      <ul>${t.map(i=>`<li>${i.title} – ${i.status}</li>`).join('')}</ul>
    </div>`;
}

function renderTickets(){
  pageContent.innerHTML=`
    <div class="card">
      <h3>Tickets</h3>
      <table>
        <tr><th>Title</th><th>Email</th><th>Status</th></tr>
        ${getTickets().map(t=>`
          <tr>
            <td>${t.title}</td>
            <td>${t.email}</td>
            <td>
              <select data-id="${t.id}">
                <option ${t.status==='Pending'?'selected':''}>Pending</option>
                <option ${t.status==='In-progress'?'selected':''}>In-progress</option>
                <option ${t.status==='Completed'?'selected':''}>Completed</option>
              </select>
            </td>
          </tr>`).join('')}
      </table>
    </div>`;
  document.querySelectorAll('select').forEach(s=>{
    s.onchange=()=>{
      const t=getTickets();
      const item=t.find(x=>x.id==s.dataset.id);
      item.status=s.value;
      saveTickets(t);
    }
  });
}

function showModal(){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="modal" id="modal">
      <div class="modal-card">
        <h3>Log Issue</h3>
        <input id="mTitle" placeholder="Issue title">
        <input id="mEmail" placeholder="Your email">
        <button id="mSave">Save</button>
      </div>
    </div>`);
  mSave.onclick=()=>{
    const t=getTickets();
    t.unshift({id:Date.now(),title:mTitle.value,email:mEmail.value,status:'Pending'});
    saveTickets(t);
    modal.remove();
    renderDashboard();
  }
}
