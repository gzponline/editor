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
		return {'x':x ,'y':y};
	},
	exec: (command, value = null) => {
        console.log(123)
        setWord.restoreSelection()
		document.execCommand(command, false, value);
	},
    queryCommandState: command => document.queryCommandState(command),
    queryCommandValue: command => document.queryCommandValue(command),

};

const testWordList = [
	"第一段 测试文字<div>测试内嵌div1</div>换行<br/><div>测试内嵌div2</div>",
	"第二段 测试文字<div>测试内嵌div1</div>换行<br/><div>测试内嵌div2</div>",
	"第三段 链接外前文字<a href= 'https://juejin.im/user/5a8a698cf265da4e896ad8ca'id ='test'> 测试自带链接</a>链接外文字</p>",
	"第四段 <div>div内文字</div>",
	"0小强",
	"1小强",
	"2小明",
	"3小红",
	"4小绿",
	"5小白",
	"第九段测试 链接外前文字<a href= 'https://juejin.im/user/5a8a698cf265da4e896ad8ca'id ='test'> 测试自带链接</a>链接外文字第九段测试 链接外前文字<a href= 'https://juejin.im/user/5a8a698cf265da4e896ad8ca'id ='test'> 测试自带链接</a>链接外文字第九段测试 链接外前文字<a href= 'https://juejin.im/user/5a8a698cf265da4e896ad8ca'id ='test'> 测试自带链接</a>链接外文字</p>",
	"7小强",
	"8小明",
	"9小红"
];

const state = {
	element:"",
	selectColor:"#FFF",
    selectWord:"",
    selectedRange: "",
    link: () => {
        return setWord.getSelectedLink()
    },
	showToolsbar: false,
};
const defaultActions = {
    bold: {
      icon: '<b>B</b>',
      title: 'Bold',
      state: () => basic.queryCommandState('bold'),
      result: () => basic.exec('bold')
    },
    italic: {
      icon: '<i>I</i>',
      title: 'Italic',
      state: () => basic.queryCommandState('italic'),
      result: () => basic.exec('italic')
    },
    strikethrough: {
      icon: '<strike>S</strike>',
      title: 'Strike-through',
      state: () => basic.queryCommandState('strikeThrough'),
      result: () => basic.exec('strikeThrough')
    },
    heading1: {
      icon: '<b>H<sub>1</sub></b>',
      title: 'Heading 1',
      result: () => basic.exec("formatBlock", '<h1>')
    },
    heading2: {
      icon: '<b>H<sub>2</sub></b>',
      title: 'Heading 2',
      result: () => basic.exec("formatBlock", '<h2>')
    },
    line: {
      icon: '&#8213;',
      title: 'Horizontal Line',
      result: () => basic.exec('insertHorizontalRule')
    },
    link: {
        icon: '<span style="text-decoration: underline;">Link</span>',
        title: 'Link',
        state: ()=> setWord.getSelectedLink(),
        result: () => {

        }
      },
}
const setWord = {
    begin(){
	    let editor = document.getElementById("editor");
		if(editor){
			editor.contentEditable = true;
			basic.addEvent(editor,"mousedown",this.selectWordStart);
			
			let chooserColorDiv = document.getElementById("chooserColor");
			let insertLink = document.getElementById("insertLink") 
			
			basic.addEvent(chooserColorDiv, "click",  setWord.liclick)
            basic.addEvent(insertLink, "click", setWord.addLink)
            // 添加工具栏
            let creatU = document.getElementById("creatU")
            const actions = Object.keys(defaultActions).map(action => defaultActions[action]);
            actions.forEach( action => {
                const button = document.createElement('li')
                button.className = "action"
                button.innerHTML = action.icon
                button.title = action.title
                button.onclick = () => action.result() && content.focus()
            
                if (action.state) {
                  const handler = () => button.classList[action.state() ? 'add' : 'remove']("yes")
                  basic.addEvent(creatU, 'keyup', handler)
                  basic.addEvent(creatU, 'mouseup', handler)
                  basic.addEvent(button, 'click', handler)
                }
                creatU.append(button)
            })
		}else{
			alert("绑定失败，请检查是否存在 id= "+ele+" 的元素！");
		}
    },
    selectWordStart(){
	    let editor = document.getElementById("editor");
        basic.addEvent(editor,"mouseup",setWord.selectWordEnd);
	},
	selectWordEnd(event){
        setWord.saveSelection()
		let word = "";
		// IE but I not have  IE
		if(document.selection){
			let sel = document.selection.createRange();
			word = sel.text;
			state.selectWord = sel;
		}else if(window.getSelection){ // chrome or firfox
			word=window.getSelection();
			state.selectWord = window.getSelection().getRangeAt(0);
		}
		// 当鼠标选中的内容不为空
		if(word != "" ){
			setWord.showDiv(event);
        }
        // 更新链接状态
        document.querySelector("#linkInput").value = state.link()? state.link(): "";
        setWord.restoreSelection()
    },
	showDiv(event){  
        let chooserColorDiv = document.getElementById("chooserColor");
		let Position = basic.getPPosition(event);
        chooserColorDiv.style.display = 'block'
		chooserColorDiv.style.top = Position.y-0+10+"px";
        chooserColorDiv.style.left = (Position.x-5)+"px";
	},
	hideDiv(){   
		if("" != document.getElementById("chooserColor")){
			document.getElementById("chooserColor").style.display = "none"
        }
        state.showToolsbar = false
	},
	liclick(event){
			if(event.target.tagName.toLowerCase() == "li"){
				let getBackgroundColor = event.target.getAttribute("tar");
				state.selectColor = getBackgroundColor;
				setWord.hideDiv();
				setWord.changeWordColor();
			}
	},
	changeWordColor(){
        setWord.restoreSelection()
		if(!state.selectWord){
			alert("您还没有选择词语，请选择！");
		}else{
			basic.exec("backColor", state.selectColor);
			//变色完成，把相关的参数初始化。
			state.selectColor = "#F1F";
			state.selectWord = "";
		}
	},
	addLink(){
        // todo 选中嵌套链接时候的处理
        setWord.restoreSelection()
        let link = document.getElementById("linkInput").value
        console.log(link)
        basic.exec("createLink", link);
    },
    unlink(){
        
    },
    getSelectedLink() {
        // 获取选区内是否包含链接 或者包括链接标题的部分文字
        if(window.getSelection().anchorNode ||window.getSelection().focusNode){
            var anchorNodeHref = window.getSelection().anchorNode.parentNode.href; // 获取选区开始处光标 后 一个字所在的节点
            var focusNodeHref = window.getSelection().focusNode.parentNode.href; // 获取选区结束处光标 前 一个字所在的节点
            if (anchorNodeHref || focusNodeHref){
                var link = anchorNodeHref || focusNodeHref
                return link
            }
        }
    },
	
    saveSelection() {
        var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            state.selectedRange = sel.getRangeAt(0);
        }
    },
    restoreSelection() {
        // 恢复选区状态
        var selection = window.getSelection();
        if (state.selectedRange) {
            try {
                selection.removeAllRanges();
            } catch (ex) {
                document.body.createTextRange().select();
                document.selection.empty();
            }
            selection.addRange(state.selectedRange);
        }
    },
};
setWord.begin("editor");

// 段落 拖拽排序
const holdItemDom = document.createElement("div");
holdItemDom.classList.add("item", "hold");
const listDom = document.createElement("div");
listDom.classList.add("items");
testWordList.forEach((v, i, arr) => {
	const itemDom = document.createElement("div");
	itemDom.classList.add("item");
	itemDom.innerHTML = v;
	itemDom.draggable = true;
	listDom.appendChild(itemDom);
});

document.querySelector("#editor").appendChild(listDom);

let dragObj, enterObj, dragIndex, enterIndex;
const itemsObj = document.querySelector(".items");

const addEventList = {
    "dragstart": (event) => {
        dragObj = event.target;
        const itemDomList = document.querySelectorAll(
            ".items .item"
        );
        itemDomList.forEach((dom, index) => {
            if (dom === dragObj) {
                dragIndex = index;
            }
        });
        if (event.target.className === "item") {
            event.target.style.opacity = 0.5;
        }
    },
    "dragend":(event) => {
        if (event.target.className === "item") {
            event.target.style.opacity = "";
        }
    },
    "dragover": (event) => {
        event.preventDefault();
    },
    "dragenter": (event) => {
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
    },
    "dragleave": (event) => {
        if (/hold/.test(event.target.classList)) {
            event.target.classList.remove("hold");
        }
    },
    "drop": (event) => {
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
    }
}
Object.keys(addEventList).map(
    addEventName =>{
        basic.addEvent(itemsObj,addEventName,(event) => {
            addEventList[addEventName](event);
        })
    }
)
