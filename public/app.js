const socket = io();

let contacts=[]
let currentPhone=""

async function loadContacts(){

 let r=await fetch("/contacts")
 contacts=await r.json()

 let box=document.getElementById("contacts")
 box.innerHTML=""

 contacts.forEach(c=>{

  let div=document.createElement("div")
  div.className="contact"
  div.innerHTML=`<input type="checkbox" class="contactCheck" value="${c.phone}"> ${c.name} (${c.phone})`

  div.onclick=()=>openChat(c)

  box.appendChild(div)

 })

}

function openChat(contact){

 currentPhone=contact.phone
 document.getElementById("chatTitle").innerText="Chat: "+contact.name

 loadMessages()

}

async function loadMessages(){

 let r=await fetch("/messages/"+currentPhone)
 let msgs=await r.json()

 let box=document.getElementById("messages")
 box.innerHTML=""

 msgs.forEach(m=>{

  let p=document.createElement("p")
  p.innerText=m.direction+": "+m.text

  box.appendChild(p)

 })

}

async function addContact(){

 await fetch("/contacts",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   name:document.getElementById("name").value,
   phone:document.getElementById("phone").value
  })
 })

 loadContacts()

}

async function uploadCSV(){

 let file=document.getElementById("csv").files[0]

 let fd=new FormData()
 fd.append("file",file)

 await fetch("/contacts/upload",{
  method:"POST",
  body:fd
 })

 alert("CSV imported")
 loadContacts()

}

async function send(){

 await fetch("/messages/send",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   phone:currentPhone,
   text:document.getElementById("msg").value
  })
 })

 loadMessages()

}

async function sendFile(){

 let file=document.getElementById("file").files[0]

 let fd=new FormData()
 fd.append("file",file)
 fd.append("phone",currentPhone)

 await fetch("/media/upload",{
  method:"POST",
  body:fd
 })

 alert("file sent")
 loadMessages()

}

loadContacts()


function searchContacts(){
  let q=document.getElementById("search").value.toLowerCase()
  let box=document.getElementById("contacts")
  box.innerHTML=""

  contacts
    .filter(c=>c.name.toLowerCase().includes(q) || c.phone.includes(q))
    .forEach(c=>{
      let div=document.createElement("div")
      div.className="contact"
      div.innerHTML=`<input type="checkbox" class="contactCheck" value="${c.phone}"> ${c.name} (${c.phone})`
      div.onclick=()=>openChat(c)
      box.appendChild(div)
    })
}


async function sendTemplateToSelected(){

 let checks=document.querySelectorAll(".contactCheck:checked")

 if(checks.length===0){
   alert("Select contacts first")
   return
 }

 let phones=[...checks].map(c=>c.value)

 let template=document.getElementById("template").value

 let params=[
  document.getElementById("p1").value,
  document.getElementById("p2").value,
  document.getElementById("p3").value,
  document.getElementById("p4").value
 ].filter(Boolean)

 await fetch("/campaign/send",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({phones,template,params})
 })

 alert("Template sent to selected contacts")

}



function logout(){
 localStorage.clear()
 window.location="/login.html"
}

function selectAllContacts(el){
 let checks=document.querySelectorAll(".contactCheck")
 checks.forEach(c=>c.checked=el.checked)
}

async function sendTemplateToSelected(){

 let checks=document.querySelectorAll(".contactCheck:checked")
 if(checks.length===0){
  alert("Select contacts")
  return
 }

 let phones=[...checks].map(c=>c.value)

 let template=document.getElementById("template").value

 let params=[
  document.getElementById("p1").value,
  document.getElementById("p2").value,
  document.getElementById("p3").value,
  document.getElementById("p4").value
 ].filter(Boolean)

 let delay=parseInt(document.getElementById("delay").value||0)

 for(let phone of phones){

  await fetch("/campaign/send",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({phones:[phone],template,params})
  })

  if(delay>0){
   await new Promise(r=>setTimeout(r,delay*1000))
  }

 }

 alert("Campaign sent")
}



// logout
function logout(){
 localStorage.clear()
 window.location="/login.html"
}

// load templates into dropdown
async function loadTemplates(){
 let res = await fetch("/templates")
 let data = await res.json()

 let dropdown=document.getElementById("templateDropdown")
 dropdown.innerHTML='<option value="">Select Template</option>'

 data.data.forEach(t=>{
  let opt=document.createElement("option")
  opt.value=t.name
  opt.text=t.name
  dropdown.appendChild(opt)
 })
}

// select all contacts
function selectAllContacts(el){
 let checks=document.querySelectorAll(".contactCheck")
 checks.forEach(c=>c.checked=el.checked)
}

// override template sender with delay
async function sendTemplateToSelected(){

 let checks=document.querySelectorAll(".contactCheck:checked")
 if(checks.length===0){
  alert("Select contacts first")
  return
 }

 let phones=[...checks].map(c=>c.value)

 let template=document.getElementById("templateDropdown").value || document.getElementById("template").value

 let params=[
  document.getElementById("p1").value,
  document.getElementById("p2").value,
  document.getElementById("p3").value,
  document.getElementById("p4").value
 ].filter(Boolean)

 let delay=parseInt(document.getElementById("delaySeconds").value || 0)

 for(let phone of phones){

  await fetch("/campaign/send",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({phones:[phone],template,params})
  })

  if(delay>0){
   await new Promise(r=>setTimeout(r,delay*1000))
  }
 }

 alert("Template campaign finished")
}



let templatesCache=[]

async function loadTemplates(){

 let res = await fetch("/templates")
 let data = await res.json()

 templatesCache = data.data

 let dropdown = document.getElementById("templateDropdown")
 dropdown.innerHTML='<option value="">Select Template</option>'

 data.data.forEach(t=>{
   let opt=document.createElement("option")
   opt.value=t.name
   opt.text=t.name
   dropdown.appendChild(opt)
 })

}

function templateSelected(){

 let name=document.getElementById("templateDropdown").value
 let t=templatesCache.find(x=>x.name===name)

 if(!t) return

 let preview=document.getElementById("templatePreview")
 let paramsBox=document.getElementById("paramContainer")

 preview.innerHTML=""
 paramsBox.innerHTML=""

 t.components.forEach(c=>{

   if(c.type==="HEADER"){
     preview.innerHTML += "<b>"+(c.text||"HEADER")+"</b><br>"
   }

   if(c.type==="BODY"){
     preview.innerHTML += c.text+"<br>"

     let matches = c.text.match(/{{\d+}}/g)
     if(matches){
       matches.forEach((m,i)=>{
         let inp=document.createElement("input")
         inp.placeholder="Param "+(i+1)
         inp.className="paramInput"
         paramsBox.appendChild(inp)
         paramsBox.appendChild(document.createElement("br"))
       })
     }
   }

   if(c.type==="FOOTER"){
     preview.innerHTML += "<small>"+c.text+"</small><br>"
   }

 })

}

async function sendTemplateToSelected(){

 let checks=document.querySelectorAll(".contactCheck:checked")
 if(checks.length===0){
   alert("Select contacts first")
   return
 }

 let phones=[...checks].map(c=>c.value)

 let template=document.getElementById("templateDropdown").value

 let params=[...document.querySelectorAll(".paramInput")].map(x=>x.value)

 let delay=parseInt(document.getElementById("delaySeconds").value||0)

 for(let phone of phones){

  await fetch("/campaign/send",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({phones:[phone],template,params})
  })

  if(delay>0){
   await new Promise(r=>setTimeout(r,delay*1000))
  }

 }

 alert("Campaign finished")

}


const socket = io();

socket.on("newMessage",(msg)=>{
 if(window.currentPhone && msg.phone===currentPhone){
   let box=document.getElementById("messages");
   let p=document.createElement("div");
   p.innerText="in: "+msg.text;
   box.appendChild(p);
 }
});

function campaignProgress(sent,total){
 let bar=document.getElementById("campaignBar");
 if(!bar)return;
 let percent=Math.floor((sent/total)*100);
 bar.style.width=percent+"%";
 bar.innerText=percent+"%";
}
