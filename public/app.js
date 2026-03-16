
let templates=[]

async function loadTemplates(){
 try{
 const res=await fetch("/api/templates")
 templates=await res.json()
 }catch(e){
 templates=[{name:"sample_template",body:"Hello {{1}} your code {{2}}",footer:"Company"}]
 }

 const sel=document.getElementById("templateSelect")
 if(!sel) return

 sel.innerHTML=""
 templates.forEach((t,i)=>{
   const o=document.createElement("option")
   o.value=i
   o.textContent=t.name
   sel.appendChild(o)
 })

 loadTemplate(0)
}

function loadTemplate(i){
 const t=templates[i]
 if(!t) return

 generateParams(t.body)

 const pb=document.getElementById("previewBody")
 const pf=document.getElementById("previewFooter")

 if(pb) pb.innerText=t.body
 if(pf) pf.innerText=t.footer||""
}

function generateParams(txt){
 const c=document.getElementById("templateParams")
 if(!c) return

 c.innerHTML=""
 const m=txt.match(/{{\d+}}/g)
 if(!m) return

 m.forEach((v,i)=>{
   const inp=document.createElement("input")
   inp.placeholder="Param "+(i+1)
   inp.className="paramInput"
   c.appendChild(inp)
 })
}

document.addEventListener("change",e=>{
 if(e.target && e.target.id==="templateSelect"){
   loadTemplate(e.target.value)
 }
 if(e.target && e.target.id==="headerMedia"){
   const file=e.target.files[0]
   const p=document.getElementById("mediaPreview")
   if(!p) return
   p.innerHTML=""
   if(!file) return
   const img=document.createElement("img")
   img.src=URL.createObjectURL(file)
   img.style.maxWidth="200px"
   p.appendChild(img)
 }
})

async function bulkSend(){
 const params=[...document.querySelectorAll(".paramInput")].map(x=>x.value)
 const contacts=[...document.querySelectorAll(".contactCheck:checked")].map(x=>x.value)

 const t=document.getElementById("templateSelect").value

 await fetch("/api/bulk-send",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({template:t,params,contacts})
 })
 alert("Bulk send triggered")
}

window.onload=loadTemplates
