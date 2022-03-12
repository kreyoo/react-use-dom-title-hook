var k=Object.defineProperty;var x=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var I=(t,n,i)=>n in t?k(t,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[n]=i,b=(t,n)=>{for(var i in n||(n={}))M.call(n,i)&&I(t,i,n[i]);if(x)for(var i of x(n))D.call(n,i)&&I(t,i,n[i]);return t};import{_ as y,r as a,j as c,S as h,a as e,C as u,T,d as w,B as g,b as f,P as v,c as C,G as O,e as B,u as P,f as G,g as L,R as V,h as R,i as E,M as N}from"./vendor.3907722f.js";const z=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerpolicy&&(l.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?l.credentials="include":o.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=i(o);fetch(o.href,l)}};z();function S(t){y(t.active?t.title:"");const n=e(w.CircleX,{color:"red",size:50}),i=e(w.CircleCheck,{color:"green",size:50}),[s,o]=a.exports.useState(t.active?i:n);return a.exports.useEffect(()=>{o(t.active?i:n)},[t.active]),c(h,{style:{margin:50},children:[e(u,{children:s}),e(u,{children:e(T,{children:t.title.trim()})})]})}function A(t){const[n,i]=a.exports.useState(!1);return c(h,{children:[e(S,{title:t.title,active:n}),e(u,{style:{marginTop:-80},children:e(g,{color:n?"gray":"blue",onClick:()=>{i(!n)},children:"Toggle"})})]})}function j(){return c("div",{style:{marginTop:50},children:[e(f,{children:"Simple Title Component"}),c(v,{withBorder:!0,padding:"xl",children:[e(T,{children:"The next examples will be shown with the following component:"}),e(S,{title:"My title"}),e(C,{language:"tsx",children:`import useDOMTitle from "react-use-dom-title-hook";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { Center, SimpleGrid, Text } from "@mantine/core";

function TitleComponent(props: {
	title: string;
	active?: boolean;
}) {
	useDOMTitle(props.active ? props.title : "");
	const notActiveIcon = <CircleX color="red" size={50} />;
	const activeIcon = <CircleCheck color="green" size={50} />;
	const [icon, setIcon] = useState<React.ReactNode>(
		props.active ? activeIcon : notActiveIcon
	);

	useEffect(() => {
		setIcon(props.active ? activeIcon : notActiveIcon);
	}, [props.active]);

	return (
		<SimpleGrid style={{ margin: 50 }}>
			<Center>{icon}</Center>
			<Center>
				<Text>{props.title.trim()}</Text>
			</Center>
		</SimpleGrid>
	);
}
	`}),e(T,{style:{marginTop:30},children:"Obviously, the component only changes the title with external input:"}),e(A,{title:"My title"}),e(C,{language:"tsx",children:`import {  SimpleGrid, Button } from "@mantine/core";
function TitleButtonComponent(props: { title: string }) {
	const [active, setActive] = useState(false);

	return (
		<SimpleGrid>
			<TitleComponent title={props.title} active={active} />
			<Center style={{ marginTop: -80 }}>
				<Button
					color={active ? "gray" : "blue"}
					onClick={() => {
						setActive(!active);
					}}>
					Toggle
				</Button>
			</Center>
		</SimpleGrid>
	);
}
	`})]})]})}function X(){const[t,n]=a.exports.useState([]),[i,s]=a.exports.useState("");return c("div",{style:{marginTop:50},children:[e(f,{children:"Playground"}),c(v,{withBorder:!0,padding:"xl",children:[e(u,{children:e(h,{cols:5>t.length?t.length:5,children:t.map((o,l)=>e(A,{title:o},l))})}),e(u,{children:c(O,{children:[e(B,{placeholder:"Add a new title",value:i,onChange:o=>{s(o.target.value)}}),e(g,{onClick:()=>{i&&(n([...t,i]),s(""))},children:"Add Title"}),e(g,{color:"red",onClick:()=>{n([])},children:"Clear all"})]})})]})]})}function p(t){const[n,i]=a.exports.useState(t.titles.map(()=>!1)),[s,o]=a.exports.useState(!1),l=a.exports.useCallback((r=0,d,m=[...n])=>{r===0&&(o(!0),d=()=>{o(!1),i(n.map(()=>!1))}),m[t.schedule[r]]=!m[t.schedule[r]],i([...m]),r+1<t.schedule.length&&setTimeout(()=>{l(r+1,d,m)},2e3),d&&r===t.schedule.length-1&&setTimeout(()=>{d&&d()},2e3)},[t.schedule]);return c("div",{style:{marginTop:50},children:[e(f,{children:t.title}),c(v,{withBorder:!0,padding:"xl",children:[e(u,{children:e(h,{cols:5>t.titles.length?t.titles.length:5,children:t.titles.map((r,d)=>e(S,{title:r,active:n[d]},d))})}),e(u,{children:e(g,{onClick:()=>{l()},disabled:s,children:"Start"})})]})]})}function _(){const[t,n]=a.exports.useState(""),[i]=P(t,3e3);return y(i),c("div",{style:{marginTop:50},children:[e(f,{children:"Type a value"}),c(v,{withBorder:!0,padding:"xl",children:[e(B,{value:t,onChange:o=>{n(o.currentTarget.value)},description:"The document title will update 3 seconds after no input change"}),e(C,{style:{marginTop:10},language:"tsx",children:`import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import useDOMTitle from "react-use-dom-title-hook";
import { TextInput } from "@mantine/core";

function TextInputComponent() {
	const [value, setValue] = useState("");
	const [debouncedValue] = useDebouncedValue(value, 3000);
	useDOMTitle(debouncedValue);
	return <TextInput
				value={value}
				onChange={(e) => {
					setValue(e.currentTarget.value);
				}}
				description="The document title will update 3 seconds after no input change"
			/>
}
    `})]})]})}function q(){return y("Demo for react-use-dom-title-hook"),e(G,{style:{height:"100vh"},children:e(L,{style:{marginTop:50},children:e(u,{children:c(h,{children:[e(_,{}),e(j,{}),e(p,{title:"Chained titles",titles:["1st title","2nd title","3rd title"],schedule:[0,1,2,2,1,0]}),e(p,{title:"Removing in the middle does not break the chain",titles:["1st title","2nd title","3rd title"],schedule:[0,1,2,1,0,2]}),e(p,{title:"Same titles form a group",titles:["1st title","Loading...","Loading...","2nd title"],schedule:[0,1,2,3,3,1,2,0]}),e(p,{title:"But they only group when mounted right after each other",titles:["1st title","Loading...","2nd title","Loading..."],schedule:[0,1,2,3,1,3,2,0]}),e(X,{}),e("div",{style:{minHeight:"5vh"}})]})})})})}function F(){const t=E(),n={children:e(q,{}),theme:{colorScheme:t,black:"#1a1b1e"}};return console.log(t),e(N,b({},n))}V.render(e(R.StrictMode,{children:e(F,{})}),document.getElementById("root"));
