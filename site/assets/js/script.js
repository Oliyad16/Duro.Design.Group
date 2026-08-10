
function hideSplash(){document.getElementById('splash').classList.add('hide');}
setTimeout(hideSplash,2200);
var NAV={services:'n-services',work:'n-work',workdetail:'n-work',about:'n-about',contact:'n-contact'};
function go(id){
 document.querySelectorAll('.page').forEach(function(p){p.classList.remove('on')});
 document.getElementById(id).classList.add('on');
 document.querySelectorAll('.menu a').forEach(function(a){a.classList.remove('active')});
 if(NAV[id])document.getElementById(NAV[id]).classList.add('active');
 if(id==='workdetail'){render();}
 window.scrollTo(0,0);
}
var PROJECTS={"harbor": {"kick": "The Harbor Bank of Maryland", "title": "Headquarters Renovation", "pill": "\u25cf In Progress \u00b7 2025", "video": "assets/videos/harbor-bank.mp4", "vposter": "assets/videos/harbor-bank-poster.jpg", "credit": "<span><b>Baltimore, MD</b></span><span>Consulting Architect <b>(design + documentation)</b></span><span><b>Commercial</b></span><span><b>2025</b></span><span><b>5,000 SF</b></span>", "narr": "A 5,000&nbsp;SF renovation of The Harbor Bank of Maryland&rsquo;s Baltimore headquarters, establishing a brand and spatial standard to guide the institution&rsquo;s future branch renovations. Duro developed and documented the design and produced the project renderings \u2014 opening the floor plate for natural light and transparency, introducing flexible meeting space and integrated technology, and carrying the bank&rsquo;s identity through material and environmental graphics.", "slides": [{"s": "assets/images/img008.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img009.jpg", "t": "N", "op": "center 75%"}, {"s": "assets/images/img010.jpg", "t": "B", "op": "center"}, {"s": "assets/images/img011.jpg", "t": "V", "op": "center 60%"}, {"s": "assets/images/img012.jpg", "t": "B", "op": "center"}, {"s": "assets/images/img013.jpg", "t": "V", "op": "center 65%"}, {"s": "assets/images/img014.jpg", "t": "B", "op": "center"}, {"s": "assets/images/img015.jpg", "t": "V", "op": "center"}, {"s": "assets/images/img016.jpg", "t": "N", "op": "center"}]}, "walter": {"kick": "Walter Pierce Park", "title": "The Ancestors Pavilion", "pill": "\u25cf Completed \u00b7 2024", "credit": "<span><b>Washington, D.C.</b></span><span><b>Architect and Engineer of Record</b></span><span><b>Public</b></span><span><b>2024</b></span>", "narr": "Walter Pierce Park rests on the grounds of two nineteenth-century burial grounds \u2014 the Friends Burying Ground and Mt. Pleasant Plains Cemetery, the busiest Reconstruction-era African American cemetery in Washington, where more than 8,400 people were laid to rest. Duro served as Architect and Engineer of Record for the Ancestors Pavilion, DC DPR&rsquo;s interpretive program honoring the site, designing the run of inscribed panels that record every name and tell the history of those who rest here, along with a new public restroom at the park entrance \u2014 work carried out with the accuracy, permanence, and care a public trust of this weight demands.", "slides": [{"s": "assets/images/img017.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img018.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img019.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img020.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img021.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img022.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img023.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img024.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img025.jpg", "t": "N", "op": "center"}]}, "hampton": {"kick": "The Hampton Residence", "title": "10545 Egret Ct", "pill": "\u25cf In Progress \u00b7 2025", "credit": "<span><b>Chesapeake Shore, MD</b></span><span><b>Architect and Engineer of Record</b></span><span><b>Residential</b></span><span><b>2025</b></span><span><b>8,000 SF</b></span>", "narr": "The Hampton Residence began as a partially constructed shell that had sat unfinished since 2012 &mdash; carrying water damage, compromised floor joists, structural miscoordination, and no functioning MEP or septic systems. Duro served as Architect and Engineer of Record, resolving each condition systematically: redesigning the structural system with new columns, beams, and footings; replacing damaged framing throughout; and developing new mechanical, electrical, plumbing, and civil systems from scratch. Alongside the technical remediation, Duro reworked the interior layout, developed a new fenestration strategy for the exterior, and integrated decks, pool, and landscape features into a cohesive design. The result is an 8,000&nbsp;SF beach residence on the Chesapeake Shore &mdash; designed and engineered to stand where the original construction could not.", "slides": [{"s": "assets/images/img026.jpg", "t": "N", "op": "center 30%"}, {"s": "assets/images/img027.jpg", "t": "N", "op": "center 40%"}, {"s": "assets/images/img028.jpg", "t": "N", "op": "center 40%"}, {"s": "assets/images/img029.jpg", "t": "N", "op": "center 40%"}, {"s": "assets/images/img030.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img031.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img032.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img033.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img034.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img035.jpg", "t": "N", "op": "center"}]}, "sinbada": {"kick": "The Sinbada Residence", "title": "2959 Fort Baker Dr SE", "pill": "\u25cf In Progress \u00b7 2026", "credit": "<span><b>Washington, D.C.</b></span><span><b>Architect and Engineer of Record</b></span><span><b>Residential</b></span><span><b>2026</b></span><span><b>3,542 SF</b></span>", "narr": "The Sinbada Residence is a full renovation of a 2,949&nbsp;SF single-family home in Southeast Washington, D.C. &mdash; a two-story brick structure on a constrained 5,500&nbsp;SF sloped lot in an R-1-B zone. Duro served as Architect and Engineer of Record, reworking the interior layout across all levels, redesigning the fenestration strategy, and reconstructing the roof to convert previously unusable attic space into a finished third level &mdash; adding 593&nbsp;SF of livable program without expanding the building footprint. The scope includes a new rear deck, primary bedroom deck, and updated interior program from basement to the new upper level. The result is a home that uses every square foot deliberately &mdash; expanding the life of the building from the inside out.", "slides": [{"s": "assets/images/img036.jpg", "t": "N", "op": "center 40%"}, {"s": "assets/images/img037.jpg", "t": "N", "op": "center 40%"}, {"s": "assets/images/img038.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img039.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img040.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img041.jpg", "t": "N", "op": "center"}, {"s": "assets/images/img042.jpg", "t": "N", "op": "center"}]}};var cur='walter';
var LBL={B:["chip B","Before"],V:["chip V","After"]};
function openProj(id){cur=id;go('workdetail');}
function render(){var P=PROJECTS[cur];
 document.getElementById('dkick').textContent=P.kick;
 document.getElementById('dtitle').textContent=P.title;
 document.getElementById('dpill').innerHTML=P.pill;
 document.getElementById('dcredit').innerHTML=P.credit;
 document.getElementById('narr').innerHTML=P.narr;
 var himg=document.getElementById('hero-img'), hvid=document.getElementById('hero-vid');
 var hchip=document.getElementById('hero-chip');
 if(P.video){
  if(hvid.getAttribute('src')!==P.video){hvid.src=P.video;}
  if(P.vposter)hvid.poster=P.vposter;
  hvid.style.display='block';himg.style.display='none';hvid.play();
  hchip.className='chip';hchip.textContent='';
 }else{
  hvid.pause();hvid.style.display='none';himg.style.display='block';
  var hero=P.slides[0];
  himg.src=hero.s;himg.style.objectPosition=hero.op||'center';
  if(LBL[hero.t]){hchip.className=LBL[hero.t][0];hchip.textContent=LBL[hero.t][1];}else{hchip.className='chip';hchip.textContent='';}
 }
 var gal=document.getElementById('gallery');gal.innerHTML='';
 for(var k=P.video?0:1;k<P.slides.length;k++){var s=P.slides[k];
  var item=document.createElement('div');item.className='gitem';
  var img=document.createElement('img');img.src=s.s;img.style.objectPosition=s.op||'center';
  item.appendChild(img);
  if(LBL[s.t]){var c=document.createElement('span');c.className=LBL[s.t][0];c.textContent=LBL[s.t][1];item.appendChild(c);}
  gal.appendChild(item);
 }}
var svcOpen=null;
function svcToggle(id){
 if(svcOpen && svcOpen!==id){
  document.getElementById('svcbody-'+svcOpen).classList.remove('open');
  document.getElementById('svcsign-'+svcOpen).textContent='+';
 }
 var body=document.getElementById('svcbody-'+id), sign=document.getElementById('svcsign-'+id);
 if(svcOpen===id){body.classList.remove('open');sign.textContent='+';svcOpen=null;}
 else{body.classList.add('open');sign.textContent='−';svcOpen=id;}
}
var workOpen=null;
function workToggle(id){
 if(workOpen && workOpen!==id){
  document.getElementById('wsecbody-'+workOpen).classList.remove('open');
  document.getElementById('wsign-'+workOpen).textContent='+';
 }
 var body=document.getElementById('wsecbody-'+id), sign=document.getElementById('wsign-'+id);
 if(workOpen===id){body.classList.remove('open');sign.textContent='+';workOpen=null;}
 else{body.classList.add('open');sign.textContent='−';workOpen=id;}
}
var HSLIDES=[
 {n:"EASTERN MARKET",l:"WASHINGTON, D.C.",img:null,video:"assets/videos/eastern-market.mp4",poster:"assets/videos/eastern-market-poster.jpg",pos:"center",size:"cover"},
 {n:"THE HAMPTON RESIDENCE",l:"CHESAPEAKE SHORE, MD",img:"assets/images/img043.jpg",pos:"center",size:"cover"},
 {n:"KC LEWIS PARK",l:"WASHINGTON, D.C.",img:null,pos:"center",size:"cover"},
 {n:"WALTER PIERCE PARK",l:"WASHINGTON, D.C.",img:"assets/images/img044.jpg",pos:"center",size:"cover"},
 {n:"THE HARBOR BANK OF MARYLAND",l:"BALTIMORE, MD",img:"assets/images/img045.jpg",pos:"center",size:"cover"},
 {n:"THE SINBADA RESIDENCE",l:"WASHINGTON, D.C.",img:"assets/images/img046.jpg",pos:"center 5%",size:"cover"}
];
var hi=0;
function hrender(){var s=HSLIDES[hi];
 document.getElementById('hcap').innerHTML='<b>'+s.n+'</b><span>'+s.l+'</span>';
 document.getElementById('hcnt').textContent=("0"+(hi+1)).slice(-2)+" / "+("0"+HSLIDES.length).slice(-2);
 var hero=document.querySelector('.hhero'), ph=document.getElementById('hph'), hv=document.getElementById('hvid');
 if(s.video){
  if(hv.getAttribute('src')!==s.video){hv.src=s.video;}
  if(s.poster)hv.poster=s.poster;
  hv.style.objectPosition=s.pos||'center';
  hv.style.display='block';hv.play();
  hero.style.backgroundImage='none';
  ph.style.display='none';
 }else if(s.img){
  hv.pause();hv.style.display='none';
  hero.style.backgroundImage='url('+s.img+')';
  hero.style.backgroundSize=s.size||'cover';
  hero.style.backgroundPosition=s.pos||'center';
  hero.style.backgroundRepeat='no-repeat';
  ph.style.display='none';
 }else{
  hv.pause();hv.style.display='none';
  hero.style.backgroundImage='none';
  ph.style.display='';
  ph.textContent='Hero image: '+s.n+' (pending)';
 }}
function hstep(d){hi=(hi+d+HSLIDES.length)%HSLIDES.length;hrender();}
function sendForm(){
 var name=document.getElementById('f-name').value.trim();
 var email=document.getElementById('f-email').value.trim();
 var company=document.getElementById('f-company').value.trim();
 var type=document.getElementById('f-type').value.trim();
 var msg=document.getElementById('f-msg').value.trim();
 var subject='New inquiry from '+(name||'website contact form');
 var lines=[];
 if(name)lines.push('Name: '+name);
 if(email)lines.push('Email: '+email);
 if(company)lines.push('Company: '+company);
 if(type)lines.push('Project Type: '+type);
 if(msg)lines.push('','Message:',msg);
 var body=lines.join('\n');
 window.location.href='mailto:info@durodesign.group?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 return false;
}
hrender();
render();
