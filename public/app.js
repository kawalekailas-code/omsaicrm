let contacts=[]
let currentPhone=""

async function loadContacts(){

 let r=await fetch("/contacts")
 contacts=await r.json()

 let box=document.getElementById("contacts")
 box.innerHTML=""

 contacts.forEach(c=>{

  let d=document.createElement("div")
  d.innerText=c.name+" "+c.phone

  d.onclick=()=>{
    currentPhone=c.phone
    loadMessages()
  }

  box.appendChild(d)

 })

}

async function addContact(){

 let name=document.getElementById("name").value
 let phone=document.getElementById("phone").value

 await fetch("/contacts",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({name,phone})
 })

 loadContacts()

}

async function loadMessages(){

 let r=await fetch("/messages/"+currentPhone)
 let data=await r.json()

 let box=document.getElementById("messages")
 box.innerHTML=""

 data.forEach(m=>{

  let p=document.createElement("p")
  p.innerText=m.direction+": "+m.text

  box.appendChild(p)

 })

}

async function send(){

 let text=document.getElementById("msg").value

 await fetch("/messages/send",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({phone:currentPhone,text})
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

 alert("File sent")
}

async function loadTemplates(){

 let r=await fetch("/templates")
 let data=await r.json()

 let box=document.getElementById("templates")
 box.innerHTML=""

 data.data.forEach(t=>{

  let d=document.createElement("div")
  d.innerText=t.name

  d.onclick=()=>{
    document.getElementById("template").value=t.name
  }

  box.appendChild(d)

 })

}

async function sendCampaign(){

 let phones=contacts.map(c=>c.phone)

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

 alert("Campaign sent")

}

loadContacts()