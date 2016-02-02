(function(w){

	var searchCate = element.byClass(".search-cate")[0],
		aCateA = element.byTag("a",searchCate),
		searchText = element.byClass(".search-text")[0],
		searchBtn = element.byClass(".search-btn")[0],
		pageBox = element.byClass(".page")[0],
		resultCon = element.byClass(".result-con")[0],
		urlSearch = window.location.search,
		urlParaArr01 = urlSearch.substring(1).split('&'),
		page = 0,
		searchKey = "";

	for(var i=0;i<urlParaArr01.length;i++){
		var urlParaArr02 = urlParaArr01[i].split('=');
		if(urlParaArr02[0]=='q'){
			searchKey = urlParaArr02[1];
			continue;
		}
		if(urlParaArr02[0]=='page'){
			page = urlParaArr02[1];
		}
	}

	if(urlSearch){
		var oScript = document.createElement("script");
		oScript.src = 'https://api.douban.com/v2/book/search?q='+ searchKey +'&start='+ (page-1)*8 +'&count=8&callback=dataFn';
		oScript.type="text/javascript";
		document.body.appendChild(oScript);
		searchText.value = decodeURI(searchKey);
	}

	function dataFn(data){
		var totalPage = nowPage = 0,
			domStr = "",
			arrImg = [],
			arrName = [],
			arrAuthor = [],
			arrAverage = [],
			arrDate = [],
			arrPublisher = [],
			arrPrice = [],
			arrLink = [];

		if( data.total<=0 ){
			resultCon.innerHTML = '未找到相关内容╮(╯▽╰)╭';
			return;
		}
		
		domStr +="<div class='book'><ul class='book-list'>";
		
		for(var i=0;i<data.count;i++){
			arrImg[i] = data.books[i].image;
			arrName[i] = data.books[i].title;
			arrAuthor[i] = data.books[i].author;
			arrAverage[i] = data.books[i].rating.average;
			arrDate[i] = data.books[i].pubdate;
			arrPublisher[i] = data.books[i].publisher;
			arrPrice[i] = data.books[i].price;
			arrLink[i] = data.books[i].id;
		
			domStr +="<li><a href='book-detail.html?pageId="+arrLink[i] +"' target='_blank'><img src='"+arrImg[i]+"'/>";
			domStr +="<p class='book-name'>"+arrName[i]+"</p></a></li>";	
			
		}
		domStr +="</ul>";	
		domStr +="<div class='book-info'><h3 class='book-tit'>"+arrName[0]+"</h3>";
		domStr +="<p class='book-author'><span class='key'>作　　者：</span><span class='val'>"+arrAuthor[0]+"</span></p>";
		domStr +="<p class='book-average'><span class='key'>评　　分：</span><span class='val'>"+arrAverage[0]+"</span></p>";
		domStr +="<p class='book-date'><span class='key'>出版日期：</span><span class='val'>"+arrDate[0]+"</span></p>";
		domStr +="<p class='book-publisher'><span class='key'>出 版 社：</span><span class='val'>"+arrPublisher[0]+"</span></p>";
		domStr +="<p class='book-price'><span class='key'>价　　格：</span><span class='val'>"+arrPrice[0]+"</span></p>";
		domStr +="<div class='arrow-box'><span class='arrow arrow01'>◆</span><span class='arrow arrow02'>◆</span></div></div>";	
		resultCon.innerHTML = domStr;
		
		var bookList = element.byClass(".book-list")[0],
			aBookLi = element.byTag("li",bookList),
			aBookLiW = aBookLi[0].offsetWidth,
			bookInfo = element.byClass(".book-info")[0],
			bookInfoW = bookInfo.offsetWidth,
			bookTit = element.byClass(".book-tit",bookInfo)[0],
			aVal = element.byClass(".val",bookInfo);
		
		for(var b=0;b<aBookLi.length;b++){
			aBookLi[b].index = b;
			aBookLi[b].onmouseover=function(){
				bookInfo.className = "book-info";
				bookInfo.style.display="block";	
				if(this.index%4==2 || this.index%4==3){
					bookInfo.className +=" book-info-l"; 
					bookInfo.style.left=this.offsetLeft-bookInfoW+10+"px";
				}
				else{
					bookInfo.style.left=this.offsetLeft+aBookLiW+"px";
				}
				bookInfo.style.top=this.offsetTop+"px";
				
				bookTit.innerHTML = arrName[this.index];
				aVal[0].innerHTML = arrAuthor[this.index];
				aVal[1].innerHTML = arrAverage[this.index];
				aVal[2].innerHTML = arrDate[this.index];
				aVal[3].innerHTML = arrPublisher[this.index];
				aVal[4].innerHTML = arrPrice[this.index];
			}
			aBookLi[b].onmouseout=function(){
				bookInfo.style.display="none";	
			}
		}

		totalPage = Math.ceil(data.total/8); // 一页显示八个
		nowPage = Math.floor(data.start/8)+1;

		var pageStr = "";
		if(totalPage>2){
			pageStr += "<a class='page-num page-home' href='javascript:;'>首页</a>";
		}
		for(var i=0;i<Math.min(10,totalPage);i++){
			tempPageNumStr = "";
			tempPageNumClass = "page-num";
			if(nowPage<=5){
				// 如果当前页码小于等于5，则生成页码依次为i+1
				tempPageNumStr = i+1;
				if(i+1==nowPage){
					tempPageNumClass = "page-cur";
				} 
			} 
			else if(totalPage>=9 && totalPage-nowPage<5){  
				// 如果当前页与总页数的差值小于5，则生成页码依次为 总页数-当前页数+i
				tempPageNumStr = totalPage-9+i;
				if(totalPage-9+i==nowPage){
					tempPageNumClass = "page-cur";
				} 
			} 
			else {
				// 不是最开始页数，也不是最后页数，则生成页码依次为 当前页数-5+i
				if(nowPage-5+i == totalPage+1){
					break;
				}
				tempPageNumStr = nowPage-5+i;
				if(nowPage-5+i==nowPage){
					tempPageNumClass = "page-cur";
				} 
			}
			pageStr += "<a class='"+ tempPageNumClass +"' href='javascript:;'>"+ tempPageNumStr +"</a>";
		}
		
		if(totalPage>2){
			pageStr += "<a class='page-num page-end' href='javascript:;'>尾页</a>";
		}
		
		pageBox.innerHTML = pageStr;
		
		var aPage = element.byTag("a",pageBox);
		for(var i=0;i<aPage.length;i++){
			aPage[i].index = i;
			aPage[i].onclick = function(){
				if(this.index==0){
					window.location.search = "q="+searchText.value+"&page=1";
				} else if(this.index==aPage.length-1){
					window.location.search = "q="+searchText.value+"&page="+totalPage;
				} else{
					window.location.search = "q="+searchText.value+"&page="+Number(this.innerHTML);
				}
				return false;
			}
		}
	}

	function searchResult(){
		if(searchText.value){
			window.location.search = "q="+searchText.value+"&page=1";
		}
		else{
			alert("请输入相关搜索词！");
		}
	}

	eventUnit.addEvent( searchText , "focus" , function(){
		this.value = "";
	});

	eventUnit.addEvent( searchText , "keyup" , function(ev){
		var ev = ev || event;
		if(ev.keyCode==13){
			searchResult();
		} 
	});

	eventUnit.addEvent( searchBtn , "click" , searchResult);

	w.dataFn = dataFn;

})(window)
	