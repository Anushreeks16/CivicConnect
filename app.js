const categories = {
  Roads:{icon:"🛣️",department:"Public Works Department"},
  "Waste Management":{icon:"♻️",department:"Solid Waste Management Department"},
  "Water Supply":{icon:"💧",department:"Water Supply Department"},
  Electricity:{icon:"💡",department:"Electrical Department"},
  "Trees & Parks":{icon:"🌳",department:"Horticulture / Tree Department"},
  Drainage:{icon:"🚰",department:"Drainage and Sewerage Department"}
};
let selectedCategory="Roads";
let latestTicket="";

function showPage(page){
  ["citizen","track","admin"].forEach(p=>document.getElementById(p+"Page").classList.toggle("hidden",p!==page));
  ["citizenNav","trackNav","adminNav"].forEach(id=>document.getElementById(id).classList.remove("active"));
  const nav={citizen:"citizenNav",track:"trackNav",admin:"adminNav"}[page];
  if(nav) document.getElementById(nav).classList.add("active");
  if(page==="admin") renderAdmin();
  window.scrollTo({top:0,behavior:"smooth"});
}
function chooseCategory(name){
  selectedCategory=name;
  document.getElementById("categoryInput").value=name;
  document.getElementById("selectedCategory").textContent=name;
  document.getElementById("selectedIcon").textContent=categories[name].icon;
  document.getElementById("reportSection").scrollIntoView({behavior:"smooth"});
}
document.getElementById("photo").addEventListener("change",e=>{
  const file=e.target.files[0], preview=document.getElementById("imagePreview");
  if(!file){preview.classList.add("hidden");return;}
  if(file.size>3*1024*1024){alert("Please choose an image smaller than 3 MB.");e.target.value="";return;}
  const reader=new FileReader();
  reader.onload=()=>{preview.src=reader.result;preview.classList.remove("hidden");};
  reader.readAsDataURL(file);
});
function getComplaints(){try{return JSON.parse(localStorage.getItem("civicconnect_complaints")||"[]")}catch(e){return []}}
function saveComplaints(data){localStorage.setItem("civicconnect_complaints",JSON.stringify(data))}
function nextTicket(){const n=Number(localStorage.getItem("civicconnect_counter")||0)+1;localStorage.setItem("civicconnect_counter",n);return "CIV-2026-"+String(n).padStart(4,"0")}
document.getElementById("complaintForm").addEventListener("submit",e=>{
  e.preventDefault();
  const file=document.getElementById("photo").files[0];
  if(!file){alert("Please upload a photo of the issue.");return;}
  const reader=new FileReader();
  reader.onload=()=>{
    const ticket=nextTicket();
    const complaint={id:ticket,category:selectedCategory,department:categories[selectedCategory].department,description:document.getElementById("description").value.trim(),area:document.getElementById("area").value.trim(),landmark:document.getElementById("landmark").value.trim(),name:document.getElementById("citizenName").value.trim(),phone:document.getElementById("phone").value.trim(),image:reader.result,status:"Pending",severity:"Medium",createdAt:new Date().toISOString()};
    const all=getComplaints();all.unshift(complaint);saveComplaints(all);
    latestTicket=ticket;document.getElementById("newTicketId").textContent=ticket;document.getElementById("successModal").classList.remove("hidden");
    e.target.reset();document.getElementById("imagePreview").classList.add("hidden");chooseCategory("Roads");
  };
  reader.readAsDataURL(file);
});
function closeModal(){document.getElementById("successModal").classList.add("hidden");}
function copyTicket(){if(navigator.clipboard)navigator.clipboard.writeText(latestTicket).then(()=>alert("Ticket ID copied."));else alert("Your ticket ID is "+latestTicket)}
function trackComplaint(){
  const id=document.getElementById("trackId").value.trim().toUpperCase(), box=document.getElementById("trackResult");
  const c=getComplaints().find(x=>x.id.toUpperCase()===id);
  if(!c){box.innerHTML='<div class="empty-state">We could not find that ticket ID. Please check it and try again.</div>';return;}
  box.innerHTML=`<div class="result-card"><strong>${escapeHTML(c.id)}</strong><br>${escapeHTML(c.category)} · ${escapeHTML(c.area)}<br>Status: <strong>${escapeHTML(c.status)}</strong><br>Department: ${escapeHTML(c.department)}<br>Priority: ${escapeHTML(c.severity)}</div>`;
}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderAdmin(){
  const all=getComplaints();
  document.getElementById("totalCount").textContent=all.length;
  document.getElementById("pendingCount").textContent=all.filter(c=>c.status==="Pending").length;
  document.getElementById("progressCount").textContent=all.filter(c=>c.status==="In Progress").length;
  document.getElementById("resolvedCount").textContent=all.filter(c=>c.status==="Resolved").length;
  document.getElementById("todayDate").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
  const search=(document.getElementById("adminSearch")?.value||"").toLowerCase();
  const status=document.getElementById("statusFilter")?.value||"All";
  const severity=document.getElementById("severityFilter")?.value||"All";
  const list=all.filter(c=>(status==="All"||c.status===status)&&(severity==="All"||c.severity===severity)&&[c.id,c.area,c.category,c.description].join(" ").toLowerCase().includes(search));
  const host=document.getElementById("adminComplaints");
  if(!list.length){host.innerHTML='<div class="empty-state">No complaints to show yet.<br>New citizen reports will appear here.</div>';return;}
  host.innerHTML=list.map(c=>`<article class="admin-complaint">
    <div><div class="complaint-meta"><span class="ticket-tag">${escapeHTML(c.id)}</span><span class="pill">${escapeHTML(c.status)}</span><span class="pill ${escapeHTML(c.severity)}">${escapeHTML(c.severity)} priority</span></div>
    <h3>${categories[c.category]?.icon||"📌"} ${escapeHTML(c.category)} · ${escapeHTML(c.area)}</h3>
    <p>${escapeHTML(c.description)}</p><div class="complaint-extra">📍 ${escapeHTML(c.landmark||"No landmark added")} &nbsp;·&nbsp; ${escapeHTML(c.department)}<br>👤 ${escapeHTML(c.name)} · ${escapeHTML(c.phone)}</div>
    ${c.image?`<img class="complaint-photo" src="${c.image}" alt="Photo attached to complaint">`:""}
    </div><div class="complaint-actions"><label class="field"><span>Priority</span><select onchange="updateComplaint('${c.id}','severity',this.value)">${["Critical","High","Medium","Low"].map(v=>`<option ${c.severity===v?"selected":""}>${v}</option>`).join("")}</select></label>
    <label class="field"><span>Update status</span><select onchange="updateComplaint('${c.id}','status',this.value)">${["Pending","In Progress","Resolved"].map(v=>`<option ${c.status===v?"selected":""}>${v}</option>`).join("")}</select></label></div></article>`).join("");
}
function updateComplaint(id,key,value){const all=getComplaints(),c=all.find(x=>x.id===id);if(c){c[key]=value;saveComplaints(all);renderAdmin();}}
document.addEventListener("DOMContentLoaded",()=>{});
