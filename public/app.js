(()=>{
const LS_USERS='fd_users_v2', LS_TICKETS='fd_tickets_v2', LS_ASSETS='fd_assets_v2', LS_SESSION='fd_session_v2';

function seed(){
  if(!localStorage.getItem(LS_USERS)){
    const users=[
      {id:1,name:'Admin User',email:'admin@pro.com',password:'admin123',role:'admin'},
      {id:2,name:'Nikita Singh',email:'nikita@pro.com',password:'nikita123',role:'employee'},
      {id:3,name:'Akshay Kumar',email:'akshay@demo.com',password:'akshay123',role:'employee'},
      {id:4,name:'Priya Sharma',email:'priya@demo.com',password:'priya123',role:'employee'},
      {id:5,name:'Ravi Patel',email:'ravi@demo.com',password:'ravi123',role:'employee'},
      {id:6,name:'Sneha Roy',email:'sneha@demo.com',password:'sneha123',role:'employee'}
    ];
    localStorage.setItem(LS_USERS,JSON.stringify(users));
  }
  if(!localStorage.getItem(LS_ASSETS)){
    const assets=[
      {id:1,name:'Dell XPS 13',cat:'Laptop',assigned:'nikita@pro.com'},
      {id:2,name:'HP LaserJet Pro',cat:'Printer',assigned:''},
      {id:3,name:'Epson Projector',cat:'AV',assigned:''},
      {id:4,name:'Samsung AC Unit',cat:'HVAC',assigned:'admin@pro.com'},
      {id:5,name:'Cisco Router',cat:'Network',assigned:'akshay@demo.com'},
      {id:6,name:'Ergonomic Chair',cat:'Furniture',assigned:''},
      {id:7,name:'iPhone 14',cat:'Mobile',assigned:'priya@demo.com'}
    ]; localStorage.setItem(LS_ASSETS,JSON.stringify(assets));
  }
  if(!localStorage.getItem(LS_TICKETS)){
    const now=Date.now();
    const tickets=[
      {id:1,title:'AC not working - Floor 2',desc:'AC is leaking water',status:'Pending',user:'nikita@pro.com',created: now - 86400000*2},
      {id:2,title:'Printer jam - HR',desc:'Paper frequently jams',status:'In-progress',user:'akshay@demo.com',created: now - 86400000*3},
      {id:3,title:'Broken chair - Floor 1',desc:'Chair wheel broken',status:'Pending',user:'nikita@pro.com',created: now - 86400000*1},
      {id:4,title:'Projector issue - Conf Room',desc:'Projector no signal',status:'In-progress',user:'akshay@demo.com',created: now - 86400000*5},
      {id:5,title:'Internet slow - Floor 3',desc:'Intermittent connectivity',status:'Pending',user:'priya@demo.com',created: now - 3600000*5},
      {id:6,title:'Software crash - Sales app',desc:'App crashes on login',status:'Pending',user:'ravi@demo.com',created: now - 86400000*4},
      {id:7,title:'Phone battery issue',desc:'Phone not charging properly',status:'Completed',user:'sneha@demo.com',created: now - 86400000*10}
    ]; localStorage.setItem(LS_TICKETS,JSON.stringify(tickets));
  }
}

function getUsers(){return JSON.parse(localStorage.getItem(LS_USERS)||'[]')}
function getTickets(){return JSON.parse(localStorage.getItem(LS_TICKETS)||'[]')}
function getAssets(){return JSON.parse(localStorage.getItem(LS_ASSETS)||'[]')}
function saveTickets(t){localStorage.setItem(LS_TICKETS,JSON.stringify(t))}
function setSession(u){localStorage.setItem(LS_SESSION,JSON.stringify(u))}
function getSession(){return JSON.parse(localStorage.getItem(LS_SESSION)||'null')}
function logout(){localStorage.removeItem(LS_SESSION); renderApp();}

function showLogin(){ const root=document.getElementById('app-root'); root.innerHTML=`
  <div class="login-page">
    <div class="login-card">
      <h3>Workplace Helpdesk</h3>
      <p class="text-muted">Sign in to manage tickets & assets</p>
      <input id="liEmail" class="form-control mb-2" placeholder="Email">
      <input id="liPass" type="password" class="form-control mb-3" placeholder="Password">
      <div class="d-flex gap-2"><button id="btnLogin" class="btn btn-primary flex-grow-1">Login</button><button id="btnSignup" class="btn btn-outline-secondary">Sign Up</button></div>
      <div id="liMsg" class="mt-2 text-danger"></div>
    </div>
  </div>`;
  document.getElementById('btnSignup').onclick=showSignup;
  document.getElementById('btnLogin').onclick=function(){ const email=document.getElementById('liEmail').value.trim(); const pass=document.getElementById('liPass').value.trim(); const u=getUsers().find(x=>x.email.toLowerCase()===email.toLowerCase() && x.password===pass); if(u){ setSession(u); renderApp(); } else { document.getElementById('liMsg').textContent='Invalid credentials'; }}}

function showSignup(){ const root=document.getElementById('app-root'); root.innerHTML=`
  <div class="login-page">
    <div class="login-card">
      <h3>Create account</h3>
      <input id="suName" class="form-control mb-2" placeholder="Full name">
      <input id="suEmail" class="form-control mb-2" placeholder="Email">
      <input id="suPass" type="password" class="form-control mb-3" placeholder="Password">
      <div class="d-flex gap-2"><button id="btnCreate" class="btn btn-success flex-grow-1">Create</button><button id="btnBack" class="btn btn-outline-secondary">Back</button></div>
      <div id="suMsg" class="mt-2 text-danger"></div>
    </div>
  </div>`;
  document.getElementById('btnBack').onclick=showLogin;
  document.getElementById('btnCreate').onclick=function(){ const name=document.getElementById('suName').value.trim(); const email=document.getElementById('suEmail').value.trim(); const pass=document.getElementById('suPass').value.trim(); if(!name||!email||!pass){ document.getElementById('suMsg').textContent='All fields required'; return; } const users=getUsers(); if(users.find(x=>x.email.toLowerCase()===email.toLowerCase())){ document.getElementById('suMsg').textContent='Email already exists'; return; } const nu={id:users.length+1,name,role:'employee',email,password:pass}; users.push(nu); localStorage.setItem(LS_USERS,JSON.stringify(users)); setSession(nu); renderApp(); }}

function buildShell(){ const root=document.getElementById('app-root'); root.innerHTML=`
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">Workplace Helpdesk</div>
      <a class="nav-item" data-view="dashboard">Dashboard</a>
      <a class="nav-item" data-view="tickets">Tickets</a>
      <a class="nav-item" data-view="assets">Assets</a>
      <a class="nav-item" data-view="activity">Activity</a>
      <a class="nav-item" data-view="users">Users</a>
    </aside>
    <div class="content">
      <div class="topbar"><h4 id="pageTitle">Dashboard</h4><div id="topRight"></div></div>
      <div id="pageContent"></div>
    </div>
  </div>`; document.querySelectorAll('.nav-item').forEach(a=>a.addEventListener('click',e=>{ const v=a.getAttribute('data-view'); document.getElementById('pageTitle').textContent = a.textContent; navigate(v); })); const tr=document.getElementById('topRight'); tr.innerHTML=''; const user=getSession(); const span=document.createElement('div'); span.className='me-3'; span.textContent=user.name+' ('+user.role+')'; const btn=document.createElement('button'); btn.className='btn btn-outline-secondary btn-sm'; btn.textContent='Logout'; btn.onclick=logout; tr.appendChild(span); tr.appendChild(btn); }

function navigate(view){ if(view==='dashboard') renderDashboard(); if(view==='tickets') renderTickets(); if(view==='assets') renderAssets(); if(view==='activity') renderActivity(); if(view==='users') renderUsers(); }

function renderDashboard(){ const tickets=getTickets(); const assets=getAssets(); const counts=tickets.reduce((acc,t)=>{ acc[t.status]=(acc[t.status]||0)+1; return acc; },{}); document.getElementById('pageContent').innerHTML = `
    <div class="card-panel">
      <h3>Dashboard</h3>
      <div class="row">
        <div class="col-md-8">
          <div class="card-panel mb-3">
            <h5>Recent Activity</h5>
            <ul id="actList"></ul>
          </div>
          <div class="card-panel mb-3">
            <h5>Quick Stats</h5>
            <div class="row">
              <div class="col"><div class="card-panel text-center"><h6>Total Tickets</h6><h3>${tickets.length}</h3></div></div>
              <div class="col"><div class="card-panel text-center"><h6>Pending</h6><h3>${counts['Pending']||0}</h3></div></div>
              <div class="col"><div class="card-panel text-center"><h6>In-progress</h6><h3>${counts['In-progress']||0}</h3></div></div>
              <div class="col"><div class="card-panel text-center"><h6>Completed</h6><h3>${counts['Completed']||0}</h3></div></div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-panel text-center">
            <h6>Ticket Status</h6>
            <div style="width:260px;height:260px;margin:auto"><canvas id="pieChart"></canvas></div>
          </div>
        </div>
      </div>
    </div>`; renderChartMain(); renderActivityList(); }

function renderChartMain(){ const ctx=document.getElementById('pieChart').getContext('2d'); const tickets=getTickets(); const counts={Pending:0,'In-progress':0,Completed:0}; tickets.forEach(t=>counts[t.status]=(counts[t.status]||0)+1); if(window._mainChart) window._mainChart.destroy(); window._mainChart=new Chart(ctx,{type:'doughnut',data:{labels:Object.keys(counts),datasets:[{data:Object.values(counts),backgroundColor:['#ff6b6b','#ffa94d','#51cf66']}]},options:{plugins:{legend:{position:'bottom'}},responsive:true,maintainAspectRatio:false}}); }

function renderActivityList(){ const list=getTickets().slice(0,8); const html=list.map(t=>`<li><strong>${t.title}</strong><div class="small-muted">${t.user} · ${new Date(t.created).toLocaleString()}</div></li>`).join(''); document.getElementById('actList').innerHTML=html; }

function renderTickets(){ const user=getSession(); const all=getTickets(); const list=(user.role==='admin')?all:all.filter(t=>t.user===user.email); const rows=list.map(t=>`<tr><td>${t.id}</td><td>${t.title}</td><td>${t.status}</td><td>${t.user}</td><td>${new Date(t.created).toLocaleDateString()}</td></tr>`).join(''); document.getElementById('pageContent').innerHTML=`
    <div class="card-panel">
      <div class="d-flex justify-content-between align-items-center mb-2"><h5>Tickets</h5><div><button id="btnNew" class="btn btn-primary btn-sm">Raise Ticket</button></div></div>
      <div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Title</th><th>Status</th><th>User</th><th>Created</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>`; document.getElementById('btnNew').onclick=showRaiseModal; }

function showRaiseModal(){ document.getElementById('pageContent').insertAdjacentHTML('beforeend',`<div id="md" style="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="background:#fff;padding:18px;border-radius:8px;max-width:600px;width:100%"><h5>Raise Ticket</h5><input id="rtTitle" class="form-control mb-2" placeholder="Title"><textarea id="rtDesc" class="form-control mb-2" rows="4" placeholder="Describe"></textarea><select id="rtStatus" class="form-select mb-2"><option>Pending</option><option>In-progress</option><option>Completed</option></select><div class="d-flex gap-2"><button id="rtOk" class="btn btn-success">Submit</button><button id="rtCancel" class="btn btn-outline-secondary">Cancel</button></div></div></div>`); document.getElementById('rtCancel').onclick=()=>document.getElementById('md').remove(); document.getElementById('rtOk').onclick=function(){ const title=document.getElementById('rtTitle').value.trim(); const desc=document.getElementById('rtDesc').value.trim(); const status=document.getElementById('rtStatus').value; if(!title||!desc){ alert('Please fill title and description'); return; } const tickets=getTickets(); const user=getSession(); const nt={id:tickets.length+1,title,desc,status,user:user.email,created:Date.now()}; tickets.unshift(nt); saveTickets(tickets); document.getElementById('md').remove(); renderTickets(); } }

function renderAssets(){ const assets=getAssets(); const rows=assets.map(a=>`<tr><td>${a.id}</td><td>${a.name}</td><td>${a.cat}</td><td>${a.assigned||'-'}</td></tr>`).join(''); document.getElementById('pageContent').innerHTML=`<div class="card-panel"><h5>Assets</h5><div class="table-responsive mt-3"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Assigned</th></tr></thead><tbody>${rows}</tbody></table></div></div>`; }

function renderActivity(){ const items=getTickets().slice(0,10).map(t=>`<li><strong>${t.title}</strong><div class="small-muted">${t.user} · ${new Date(t.created).toLocaleString()}</div></li>`).join(''); document.getElementById('pageContent').innerHTML=`<div class="card-panel"><h5>Activity Feed</h5><ul>${items}</ul></div>`; }

function renderUsers(){ const users=getUsers(); const rows=users.map(u=>`<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`).join(''); document.getElementById('pageContent').innerHTML=`<div class="card-panel"><h5>Users</h5><div class="table-responsive mt-3"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>${rows}</tbody></table></div></div>`; }

function renderApp(){ seed(); const user=getSession(); if(!user){ showLogin(); return; } buildShell(); navigate('dashboard'); } document.addEventListener('DOMContentLoaded',()=>{ renderApp(); }); })();
