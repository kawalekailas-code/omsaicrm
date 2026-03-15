
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
  div.innerText=c.name+" ("+c.phone+")"

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
      div.innerText=c.name+" ("+c.phone+")"
      div.onclick=()=>openChat(c)
      box.appendChild(div)
    })
}
