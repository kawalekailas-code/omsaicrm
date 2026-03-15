let currentPhone=""

async function loadContacts(){

 let res=await fetch("/contacts")
 let data=await res.json()

 let box=document.getElementById("contacts")
 box.innerHTML=""

 data.forEach(c=>{

  let div=document.createElement("div")
  div.innerText=c.name+" "+c.phone
  div.style.cursor="pointer"

  div.onclick=()=>openChat(c.phone,c.name)

  box.appendChild(div)

 })

}

function searchContact(){

 let term=document.getElementById("search").value.toLowerCase()
 let items=document.querySelectorAll("#contacts div")

 items.forEach(i=>{
  i.style.display=i.innerText.toLowerCase().includes(term)?"block":"none"
 })

}

async function openChat(phone,name){

 currentPhone=phone
 document.getElementById("chatTitle").innerText=name

 let res=await fetch("/messages/"+phone)
 let msgs=await res.json()

 let chat=document.getElementById("chat")
 chat.innerHTML=""

 msgs.forEach(m=>{

  let p=document.createElement("p")
  p.innerText=m.direction+": "+m.text+" ("+new Date(m.createdAt).toLocaleTimeString()+")"
  chat.appendChild(p)

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

async function uploadCSV(){

 let file=document.getElementById("csvFile").files[0]

 let fd=new FormData()
 fd.append("file",file)

 await fetch("/contacts/upload",{method:"POST",body:fd})

 alert("Contacts imported")

 loadContacts()

}

async function sendMsg(){

 let text=document.getElementById("msgText").value

 await fetch("/messages/send",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({phone:currentPhone,text})
 })

 openChat(currentPhone,"")

}

function toggleDark(){
 document.body.classList.toggle("dark")
}

loadContacts()