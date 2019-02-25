const basic = {
	addEvent(obj,eType,fuc){
		if(obj.addEventListener){ 
			obj.addEventListener(eType,fuc,false); 
		}else if(obj.attachEvent){ 
			obj.attachEvent("on" + eType,fuc); 
		}else{ 
			obj["on" + eType] = fuc; 
		}
	},
	removeEvent(obj,eType,fuc){
		if(obj.removeEventListener){ 
			obj.removeEventListener(eType,fuc,false); 
		}else if(obj.attachEvent){ 
			obj.detachEvent("on" + eType,fuc); 
		} 
	},
	stopPropagation(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},
	preventDefault(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
		//IE
		event.returnValue = false;
		}
	},
	getPPosition(event){
		let x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
		let y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
		return {'x':x,'y':y};
	},
	exec: (command, value = null) => {
		document.execCommand(command, false, value);
	},
	queryCommandState: command => document.queryCommandState(command)

};

const defaultWordList = [
	"1 01234567890/11234567890/<br />21234567890<i>31234567890</i>41234567890<br />我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师<br />我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师</p>",
	"2 0 1234567890/11234567890/<br />21234567890<i>31234567890</i>41234567890<br />我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师<br />我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师</p>",
	"3 0 1234567890/11234567890/<br />21234567890<i>31234567890</i>41234567890<br />我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师<br />我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师我是一名工程师</p>",
	"<div>wosiyshi </div>",
	"0小强zaxsdcfvgbhnujimk",
	"1小强azwsdtgbynujmi,o",
	"2小明zaqwxsdcvfgbhnujiko",
	"3小红",
	"4小绿ìzawsxedcrfvtgbyhnujmik",
	"5小白zaqwsxedcrfvtgbyhnujmi",
	"6小紫",
	"7小强zawsxedcrfvtgbyujmi",
	"8小明azqwsxecdrfvtbgyhnujmik,o",
	"9小红zqawxsedcrfvtgbyhnujmiko,,,,,l"
];

const setWord = {
	element:"",
	selectColor:"#FFF",
	selectWord:"",
	colors:["blue","green","red","yellow","grey"],
	begin(ele){
		if(ele){
			this.element = document.getElementById(ele);
		}
		if(this.element){
			this.element.contentEditable = true;
			basic.addEvent(this.element,"mousedown",this.bind.selectWordStart);
			
			let chooserColorDiv = document.getElementById("chooserColor");
			let creatS = document.getElementById("creatS")
			let insertLink = document.getElementById("insertLink") 
			
			basic.addEvent(chooserColorDiv, "click",  setWord.createDiv.liclick)
			basic.addEvent(creatS, "click", setWord.createDiv.hideDiv)
			// basic.addEvent(insertLink, "click", setWord.createDiv.addLink)

		}else{
			alert("绑定失败，请检查是否存在 id= "+ele+" 的元素！");
		}
	},
};

setWord.createDiv = {
	showDiv(event){  
		let chooserColorDiv = document.getElementById("chooserColor");
		chooserColorDiv.style.display = "inline"
		let Position = basic.getPPosition(event);
		chooserColorDiv.style.top = Position.y-0+10+"px";
		chooserColorDiv.style.left = (Position.x-5)+"px";
	},
	hideDiv(){   
		if("" != document.getElementById("chooserColor")){
			document.getElementById("chooserColor").style.display = "none"
		}
	},
	liclick(event){
			if(event.target.tagName.toLowerCase() == "button"){
				let getBackgroundColor = event.target.getAttribute("tar");
				setWord.selectColor = getBackgroundColor;
				setWord.createDiv.hideDiv();
				setWord.createDiv.changeWordColor();
			}
	},
	changeWordColor(){     
		if(!setWord.selectWord){
			alert("您还没有选择词语，请选择！");
		}else{
			basic.exec("backColor", setWord.selectColor);
			//变色完成，把相关的参数初始化。
			setWord.selectColor = "#F1F";
			setWord.selectWord = "";
		}
	},
	// addLink(event){
	// 	let link = document.getElementById("linkInput").value
	// 	basic.exec("createLink", true, link);
	// },
	
};
setWord.bind = {
	selectWordStart(){
		basic.addEvent(setWord.element,"mouseup",setWord.bind.selectWordEnd);
	},
	selectWordEnd(event){     
		let word = "";
		// IE but I not have  IE
		if(document.selection){
			let sel = document.selection.createRange();
			word = sel.text;
			setWord.selectWord = sel;
		}else if(window.getSelection){ // chrome or firfox
			word=window.getSelection();
			setWord.selectWord = window.getSelection().getRangeAt(0);
		}
		// 当鼠标选中的内容不为空 或者 鼠标右键单击时候
		if(word != "" ){
			// || event.button == 2
			setWord.createDiv.showDiv(event);
		}
		
	},
	
	
};
setWord.begin("editor");

// 段落 拖拽排序
const holdItemDom = document.createElement("div");
holdItemDom.classList.add("item", "hold");
const listDom = document.createElement("div");
listDom.classList.add("items");
defaultWordList.forEach((v, i, arr) => {
	const itemDom = document.createElement("div");
	itemDom.classList.add("item");
	itemDom.innerHTML = v;
	itemDom.draggable = true;
	listDom.appendChild(itemDom);
});

document.querySelector("#editor").appendChild(listDom);

let dragObj, enterObj, dragIndex, enterIndex;
const itemsObj = document.querySelector(".items");

basic.addEvent(itemsObj,"dragstart",(event) => {
	dragObj = event.target;
	const itemDomList = document.querySelectorAll(
		".items .item"
	);
	itemDomList.forEach((dom, index) => {
		if (dom === dragObj) {
			dragIndex = index;
		}
	});
	event.target.style.opacity = 0.5;
})
basic.addEvent(itemsObj,"dragend",(event) => {
	event.target.style.opacity = "";
})

basic.addEvent(itemsObj,"dragover",(event) => {
	event.preventDefault();
})

basic.addEvent(itemsObj,"dragenter",(event) => {
	if (event.target.className === "item") {
		event.target.classList.add("hold");
	}
	enterObj = event.target;
	const itemDomList = document.querySelectorAll(
		".items .item"
	);
	itemDomList.forEach((dom, index) => {
		if (dom === enterObj) {
			enterIndex = index;
		}
	});
})

basic.addEvent(itemsObj,"dragleave",(event) => {
	if (/hold/.test(event.target.classList)) {
		event.target.classList.remove("hold");
	}
})

basic.addEvent(itemsObj,"drop",(event) => {
	event.preventDefault();
	enterObj.classList.remove("hold");
	if(event.target.className !== "item"){
		return
	}
	if (dragIndex < enterIndex) {
		dragObj.remove();
		enterObj.after(dragObj);
	} else if (dragIndex > enterIndex) {
		dragObj.remove();
		enterObj.before(dragObj);
	}
})

basic.addEvent(document,"dragexit",(event) => {
	event.preventDefault();

})
