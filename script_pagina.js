// Lógica da página - Mercado de Trabalho (App Inatel)
// Dados das vagas: vagas.json | Cartão da vaga: script_componente.js
const ALUNO={curso:"Engenharia de Software",periodo:5};
const ST=["Enviada","Em análise","Entrevista","Resultado"];
let VAGAS=[];
let F={area:"Todas",mod:"Todas",carga:"Todas"},vaga=null,curr=null,cands=[],hist=["home"];
const $=id=>document.getElementById(id);
const compat=v=>{if(!v.cursos.includes(ALUNO.curso))return 0;return ALUNO.periodo>=v.pmin?95:Math.max(60,95-(v.pmin-ALUNO.periodo)*15)};
const cor=p=>p>=90?"var(--ok)":p>=60?"var(--warn)":"var(--err)";
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),3200)}
const TIT={home:"",vagas:"Mercado de Trabalho",detalhe:"Detalhes da vaga",perfil:"Candidatura",revisao:"Candidatura",sucesso:"Confirmação",cands:"Minhas candidaturas"};
function go(n,back){
 document.querySelectorAll(".tela").forEach(s=>s.classList.toggle("on",s.id===n));
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.n===n));
 if(!back&&hist[hist.length-1]!==n)hist.push(n);
 $("topo").innerHTML=n==="home"?`<button class="ib">☰</button><h1>Inatel</h1><button class="ib">👤</button>`
  :`<button class="ib" onclick="voltar()">‹</button><h2>${TIT[n]}</h2><span style="width:40px"></span>`;
 if(n==="vagas")listar();if(n==="cands")listarC();
 document.querySelector("main").scrollTop=0}
function voltar(){hist.pop();go(hist[hist.length-1]||"home",true)}
function chips(id,op,k){$(id).innerHTML=op.map(o=>`<button class="chip ${F[k]===o?"on":""}" onclick="F['${k}']='${o}';listar()">${o}</button>`).join("")}
function listar(){
 chips("fArea",["Todas","Desenvolvimento","Qualidade","Dados","Telecom"],"area");
 chips("fMod",["Todas","Presencial","Remoto","Híbrido"],"mod");
 chips("fCarga",["Todas","4h","6h"],"carga");
 const r=VAGAS.filter(v=>(F.area==="Todas"||v.area===F.area)&&(F.mod==="Todas"||v.mod===F.mod)&&(F.carga==="Todas"||v.carga===F.carga)).sort((a,b)=>compat(b)-compat(a));
 $("cont").textContent=r.length+" vaga(s) encontrada(s) · ordenadas por compatibilidade";
 // Cria um <vaga-component> para cada vaga filtrada
 $("lista").innerHTML=r.length?"":`<div class="vazio">Nenhuma vaga com esses filtros.<br>Tente remover algum filtro.</div>`;
 r.forEach(v=>{const el=document.createElement("vaga-component");const c=compat(v);el.dados={...v,compat:c,cor:cor(c)};$("lista").appendChild(el)})}
$("lista").addEventListener("vaga-selecionada",e=>abrir(e.detail));
function abrir(id){vaga=VAGAS.find(v=>v.id===id);const c=compat(vaga);
 const jaTem=cands.some(x=>x.v.id===id);
 $("detCorpo").innerHTML=`<h3 style="margin:0">${vaga.t}</h3><small>${vaga.e}</small><br>
 <span class="tag" style="background:${cor(c)};color:#fff">${c}% compatível com seu curso e período</span>
 <p style="font-size:14px">${vaga.desc}</p>
 <div class="lin"><span>Modalidade</span><b>${vaga.mod}</b></div><div class="lin"><span>Carga horária</span><b>${vaga.carga}/dia</b></div>
 <div class="lin"><span>Bolsa</span><b>${vaga.bolsa}</b></div><div class="lin"><span>Período mínimo</span><b>${vaga.pmin}º</b></div>
 <div class="lin"><span>Cursos</span><b style="text-align:right;max-width:60%">${vaga.cursos.join(", ")}</b></div>
 ${c===0?'<p style="color:var(--err);font-size:13px">Esta vaga não é voltada ao seu curso.</p>':''}${jaTem?'<p style="color:var(--ok);font-size:13px">Você já se candidatou a esta vaga.</p>':''}`;
 const b=document.querySelector("#detalhe .btn");b.disabled=c===0||jaTem;go("detalhe")}
function mascara(){let d=$("tel").value.replace(/\D/g,"").slice(0,11);
 $("tel").value=d.length>6?`(${d.slice(0,2)}) ${d.slice(2,3)} ${d.slice(3,7)}-${d.slice(7)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d}
$("tel").addEventListener("input",mascara);
function anexo(nome,kb){$("bar").style.display="block";let p=0;const i=setInterval(()=>{p+=20;$("barIn").style.width=p+"%";
 if(p>=100){clearInterval(i);curr={nome,kb};$("bar").style.display="none";$("barIn").style.width=0;
 $("arqOk").innerHTML=`<div class="arq">📄 <div style="flex:1"><b>${nome}</b><br><small>${kb} KB</small></div><button class="ib" style="font-size:16px;width:28px;height:28px" onclick="curr=null;$('arqOk').innerHTML=''">✕</button></div>`;
 $("drop").classList.remove("erro");$("eCurr").classList.remove("on");toast("Currículo anexado e guardado para próximas candidaturas.")}},120)}
$("arq").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;
 if(!/\.pdf$/i.test(f.name)||f.size>2*1024*1024){$("drop").classList.add("erro");$("eCurr").textContent="Arquivo inválido: envie um PDF de até 2 MB.";$("eCurr").classList.add("on");return}
 anexo(f.name,Math.round(f.size/1024))});
function usarModelo(){anexo("curriculo_gabriel_lopes.pdf",84)}
function valida(){let ok=true;
 const em=/^\S+@\S+\.\S+$/.test($("email").value),tl=$("tel").value.replace(/\D/g,"").length===11;
 [["email","eEmail",em],["tel","eTel",tl]].forEach(([i,m,v])=>{$(i).classList.toggle("erro",!v);$(m).classList.toggle("on",!v);if(!v)ok=false});
 if(!curr){$("drop").classList.add("erro");$("eCurr").textContent="Anexe um currículo em PDF (até 2 MB).";$("eCurr").classList.add("on");ok=false}
 return ok}
function revisar(){if(!valida()){$("pend").classList.add("on");toast("Faltam dados obrigatórios.");return}
 $("pend").classList.remove("on");
 $("revCorpo").innerHTML=`<b>${vaga.t}</b><br><small>${vaga.e} · ${vaga.mod} · ${vaga.carga}/dia</small>
 <div class="lin"><span>Candidato</span><b>Gabriel Silva Lopes</b></div><div class="lin"><span>Curso</span><b>Eng. de Software · 5º</b></div>
 <div class="lin"><span>E-mail</span><b>${$("email").value}</b></div><div class="lin"><span>Telefone</span><b>${$("tel").value}</b></div>
 <div class="lin"><span>Currículo</span><b>${curr.nome}</b></div>`;go("revisao")}
function enviar(){if(!$("aceite").checked){$("eAceite").classList.add("on");return}
 $("eAceite").classList.remove("on");const b=$("bEnv");b.disabled=true;b.textContent="Enviando...";
 setTimeout(()=>{const pr="EST-"+new Date().getFullYear()+"-"+String(1000+Math.floor(Math.random()*9000));
 cands.push({v:vaga,pr,st:0,data:new Date().toLocaleDateString("pt-BR")});
 $("sucCorpo").innerHTML=`<div class="lin"><span>Protocolo</span><b>${pr}</b></div><div class="lin"><span>Vaga</span><b>${vaga.t}</b></div>
 <p style="font-size:13px;margin:10px 0 0">📧 Comprovante enviado para <b>${$("email").value}</b>.</p>`;
 b.disabled=false;b.textContent="Confirmar envio";$("aceite").checked=false;
 const n=VAGAS.filter(v=>v.nova&&!cands.some(c=>c.v.id===v.id)&&compat(v)>0).length;$("bdg").textContent=n;$("nNovas").textContent=n;
 hist=["home","vagas"];go("sucesso");toast("✅ Candidatura enviada. Comprovante no seu e-mail.")},1300)}
function listarC(){$("listaC").innerHTML=cands.length?cands.map((c,i)=>`<div class="card"><b>${c.v.t}</b><br><small>${c.v.e} · ${c.pr} · ${c.data}</small>
 <div class="tl">${ST.map((s,k)=>`<div class="${k<=c.st?"f":""}">${s}</div>`).join("")}</div>
 <button class="btn sec" style="font-size:12px;padding:8px" ${c.st>=3?"disabled":""} onclick="avanca(${i})">Simular atualização de status</button></div>`).join("")
 :`<div class="vazio">Você ainda não se candidatou.<br><br><button class="btn" onclick="go('vagas')">Buscar vagas</button></div>`}
function avanca(i){const c=cands[i];c.st++;listarC();
 toast(`🔔 ${c.v.e}: sua candidatura agora está "${ST[c.st]}"${c.st===3?" — Aprovada! 🎉":""}`)}
// Carrega as vagas do arquivo JSON
async function carregarVagas(){
 try{const resp=await fetch("vagas.json");VAGAS=await resp.json();
  const n=VAGAS.filter(v=>v.nova&&compat(v)>0).length;$("bdg").textContent=n;$("nNovas").textContent=n;
 }catch(erro){console.error("Erro ao carregar as vagas:",erro)}}
carregarVagas();
go("home");
