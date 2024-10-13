(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))e(l);new MutationObserver(l=>{for(const h of l)if(h.type==="childList")for(const f of h.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&e(f)}).observe(document,{childList:!0,subtree:!0});function t(l){const h={};return l.integrity&&(h.integrity=l.integrity),l.referrerPolicy&&(h.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?h.credentials="include":l.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function e(l){if(l.ep)return;l.ep=!0;const h=t(l);fetch(l.href,h)}})();const a=document.getElementById("canvas"),b=document.getElementById("k"),R=document.getElementById("rnd");let g=Number.parseInt(b.value)|3,n=[];const c={vertButtonWidth:50,horzButtonHeigth:50};let i={topButtonRow:[],bottomButtonRow:[],leftButtonCol:[],rightButtonCol:[],field:[]};const y=[];R.onclick=()=>{const r=[];for(let o=0;o<n.length;o++)for(let t=0;t<n[o].length;t++)n[o][t]||r.push({x:t,y:o});if(r&&r.length>0){const o=Math.floor(Math.random()*r.length),t=r[o],e=[4,2],l=e[Math.floor(Math.random()*e.length)];switch(l){case 2:y.push({kind:"setTwo",row:t.y,col:t.x});break;case 4:y.push({kind:"setFour",row:t.y,col:t.x});break;default:console.error(`something wrong, unexpected value ${l}`)}}};b.onchange=r=>{const o=r.target;if(o.value){const t=Number.parseInt(o.value);y.push({kind:"restart",k:t})}};a.onmouseup=r=>{const o={x:r.offsetX,y:r.offsetY};let t;for(let e=0;e<i.topButtonRow.length;e++)if(w(o,i.topButtonRow[e])){t={kind:"playUp",col:e};break}if(t===void 0){for(let e=0;e<i.bottomButtonRow.length;e++)if(w(o,i.bottomButtonRow[e])){t={kind:"playDown",col:e};break}}if(t===void 0){for(let e=0;e<i.leftButtonCol.length;e++)if(w(o,i.leftButtonCol[e])){t={kind:"playLeft",row:e};break}}if(t===void 0){for(let e=0;e<i.rightButtonCol.length;e++)if(w(o,i.rightButtonCol[e])){t={kind:"playRight",row:e};break}}if(t===void 0){for(let e=0;e<i.field.length;e++)for(let l=0;l<i.field[e].length;l++)if(w(o,i.field[e][l])){switch(r.button){case 0:t={kind:"setFour",row:e,col:l};break;case 2:t={kind:"setTwo",row:e,col:l};break}break}}t!==void 0&&y.push(t)};k(g);requestAnimationFrame(r=>{requestAnimationFrame(o=>v())});function k(r){n=[],i={topButtonRow:[],bottomButtonRow:[],leftButtonCol:[],rightButtonCol:[],field:[]};for(let s=0;s<r;s++){n.push([]);for(let u=0;u<r;u++)n[s].push(0)}let o={x:c.vertButtonWidth,y:0},t={x:c.vertButtonWidth,y:c.horzButtonHeigth+a.height-2*c.horzButtonHeigth},e=1/r*(a.width-2*c.vertButtonWidth);for(let s=0;s<r;s++){let u=o.x+s*e,d=o.y,p={x:u,y:d,w:e,h:c.horzButtonHeigth};i.topButtonRow.push(p),u=t.x+s*e,d=t.y;let B={x:u,y:d,w:e,h:c.horzButtonHeigth};i.bottomButtonRow.push(B)}let l={x:0,y:c.horzButtonHeigth},h={x:c.vertButtonWidth+a.width-2*c.vertButtonWidth,y:c.horzButtonHeigth},f=1/r*(a.height-2*c.horzButtonHeigth);for(let s=0;s<r;s++){let u=l.x,d=l.y+s*f,p={x:u,y:d,w:c.vertButtonWidth,h:f};i.leftButtonCol.push(p),u=h.x,d=h.y+s*f;let B={x:u,y:d,w:c.vertButtonWidth,h:f};i.rightButtonCol.push(B)}let m={x:c.vertButtonWidth,y:c.horzButtonHeigth},x={x:1/r*(a.width-2*c.vertButtonWidth),y:1/r*(a.height-2*c.horzButtonHeigth)};for(let s=0;s<r;s++){i.field.push([]);for(let u=0;u<r;u++)i.field[s].push({x:m.x+u*x.x,y:m.y+s*x.y,w:x.x,h:x.y})}}function w(r,o){return o.x<=r.x&&r.x<=o.x+o.w&&o.y<=r.y&&r.y<=o.y+o.h}function C(r){for(let o=y.pop();o;o=y.pop())switch(o.kind){case"setFour":n[o.row][o.col]===0&&(n[o.row][o.col]=4);break;case"setTwo":n[o.row][o.col]===0&&(n[o.row][o.col]=2);break;case"playLeft":{const t=n[o.row];for(let e=0;e<t.length;e++)if(t[e]!==0&&t[e]===t[e+1]){t[e]+=t[e+1];for(let l=e+1;l<t.length-1;l++)t[l]=t[l+1];t[t.length-1]=0}}break;case"playRight":{const t=n[o.row];for(let e=t.length-1;e>0;e--)if(t[e]!==0&&t[e]===t[e-1]){t[e]+=t[e-1];for(let l=e-1;l>0;l--)t[l]=t[l-1];t[0]=0}}break;case"playDown":for(let t=n.length-1;t>0;t--)if(n[t][o.col]!==0&&n[t][o.col]===n[t-1][o.col]){n[t][o.col]+=n[t-1][o.col];for(let e=t-1;e>0;e--)n[e][o.col]=n[e-1][o.col];n[0][o.col]=0}break;case"playUp":for(let t=0;t<n.length;t++)if(n[t][o.col]!==0&&n[t][o.col]===n[t+1][o.col]){n[t][o.col]+=n[t+1][o.col];for(let e=t+1;e<n.length-1;e++)n[e][o.col]=n[e+1][o.col];n[n.length-1][o.col]=0}break;case"restart":g=o.k,k(g)}}function S(){const r=a.getContext("2d");r.save(),r.font="48px courier-new",r.textBaseline="middle",r.textAlign="center",r.lineWidth=5,r.strokeStyle="blue",r.fillStyle="white",r.save();for(let o=0;o<i.topButtonRow.length;o++){const t=i.topButtonRow[o];r.fillRect(t.x,t.y,t.w,t.h),r.strokeRect(t.x,t.y,t.w,t.h),r.strokeStyle="black";let e="U";const l={x:t.x+t.w/2,y:t.y+t.h/2};r.strokeText(e,l.x,l.y)}r.restore(),r.save();for(let o=0;o<i.bottomButtonRow.length;o++){const t=i.bottomButtonRow[o];r.fillRect(t.x,t.y,t.w,t.h),r.strokeRect(t.x,t.y,t.w,t.h),r.strokeStyle="black";let e="D";const l={x:t.x+t.w/2,y:t.y+t.h/2};r.strokeText(e,l.x,l.y)}r.restore(),r.save();for(let o=0;o<i.leftButtonCol.length;o++){const t=i.leftButtonCol[o];r.fillRect(t.x,t.y,t.w,t.h),r.strokeRect(t.x,t.y,t.w,t.h),r.strokeStyle="black";let e="L";const l={x:t.x+t.w/2,y:t.y+t.h/2};r.strokeText(e,l.x,l.y)}r.restore(),r.save();for(let o=0;o<i.rightButtonCol.length;o++){const t=i.rightButtonCol[o];r.fillRect(t.x,t.y,t.w,t.h),r.strokeRect(t.x,t.y,t.w,t.h),r.strokeStyle="black";let e="R";const l={x:t.x+t.w/2,y:t.y+t.h/2};r.strokeText(e,l.x,l.y)}r.restore(),r.save(),r.fillStyle="gray";for(let o=0;o<g;o++)for(let t=0;t<g;t++){const e=i.field[o][t];if(r.fillRect(e.x,e.y,e.w,e.h),r.strokeStyle="blue",r.strokeRect(e.x,e.y,e.w,e.h),n[o][t]){const l={x:e.x+e.w/2,y:e.y+e.h/2};r.strokeStyle="white";let h=n[o][t].toString();r.strokeText(h,l.x,l.y)}}r.restore(),r.restore()}function v(r,o){C(),S(),requestAnimationFrame(t=>v())}
