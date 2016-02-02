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
		oScript.src = 'https://api.douban.com/v2/movie/search?q='+ searchKey +'&start='+ (page-1)*8 +'&count=8&callback=dataFn';
		oScript.type="text/javascript";
		document.body.appendChild(oScript);
		searchText.value = decodeURI(searchKey);
	}

	function dataFn(data){
		var totalPage = nowPage = 0,
			domStr = strCast = "",
			arrImg = [],
			arrName = [],
			arrAuthor = [],
			arrCast = [],
			arrCate = [],
			arrYear = [],
			arrPublisher = [],
			arrAverage = [];

		if(data.total<=0){
			resultCon.innerHTML = '未找到相关内容╮(╯▽╰)╭';
			return;
		}		
		
		domStr +="<div class='movie'>";

		for(var i=0;i<data.count;i++){
			arrImg[i] = data.subjects[i].images.medium || '';
			arrName[i] = data.subjects[i].title || '无题';
			arrAuthor[i] = data.subjects[i].directors.name || "佚名";
			arrCate[i] = data.subjects[i].genres;
			arrYear[i] = data.subjects[i].year;
			arrAverage[i] = data.subjects[i].rating.average;
			strCast = "";

			for(var j=0;j<data.subjects[i].casts.length;j++){
				if(j==data.subjects[i].casts.length-1){
					strCast += data.subjects[i].casts[j].name;
				}
				else{
					strCast += data.subjects[i].casts[j].name+",";
				}
			}
			arrCast[i] = strCast;

			domStr +="<div class='movie-item'><div class='movie-summary'><div class='movie-pic'>";
			domStr +="<img src='"+arrImg[i]+"'/></div><div class='movie-info'>";
			domStr +="<h3 class='movie-name'>"+arrName[i]+"</h3>";
			domStr +="<p class='movie-directors'><span class='key'>导演：</span><span class='val'>"+arrAuthor[i]+"</span></p>";
			domStr +="<p class='movie-casts'><span class='key'>演员：</span><span class='val'>"+arrCast[i]+"</span></p>";
			domStr +="<p class='movie-genres'><span class='key'>类型：</span><span class='val'>"+arrCate[i]+"</span></p>";
			domStr +="<p class='movie-year'><span class='key'>年份：</span><span class='val'>"+arrYear[i]+"</span></p>";
			domStr +="<p class='movie-average'><span class='key'>评分：</span><span class='val'>"+arrAverage[i]+"</span></p>";
			domStr +="</div></div></div>";
		}
		domStr +="</div>";	
		resultCon.innerHTML = domStr;

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