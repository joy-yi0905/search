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
		oScript.src = 'https://api.douban.com/v2/music/search?q='+ searchKey +'&start='+ (page-1)*5 +'&count=5&callback=dataFn';
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
			arrVer = [],
			arrVerTit = [],
			arrMedia = [],
			arrAverage = [],
			arrDate = [],
			arrTracks = [],
			arrSongTemp = [];

		if(data.total<=0){
			resultCon.innerHTML = '未找到相关内容╮(╯▽╰)╭';
			return;
		}

		domStr +="<div class='music'>";
		
		for(var i=0;i<data.count;i++){
			arrImg[i] = data.musics[i].image;
			arrName[i] = data.musics[i].title;
			arrAuthor[i] = data.musics[i].attrs.singer || "佚名";
			arrVer[i] = data.musics[i].attrs.version || "未知";
			arrVerTit[i] = data.musics[i].attrs.title || "未知";
			arrMedia[i] = data.musics[i].attrs.media || "未知介质";
			arrAverage[i] = data.musics[i].rating.average;
			arrDate[i] = data.musics[i].attrs.pubdate || "未知日期";
			
			domStr +="<div class='music-item'><div class='music-pic'><img src='"+arrImg[i]+"' alt=''/>"
			domStr +="<p>"+arrName[i]+"</p></div><div class='music-info'>";
			domStr +="<p class='music-singer'><span class='key'>歌手：</span><span class='val'>"+arrAuthor[i]+"</span></p>";
			domStr +="<p class='music-casts'><span class='key'>专辑：</span><span class='val'>"+arrVer[i]+"/"+arrVerTit[i]+"</span></p>";
			domStr +="<p class='music-genres'><span class='key'>介质：</span><span class='val'>"+arrMedia[i]+"</span></p>";
			domStr +="<p class='music-year'><span class='key'>日期：</span><span class='val'>"+arrDate[i]+"</span></p>";
			domStr +="<p class='music-average'><span class='key'>评分：</span><span class='val'>"+arrAverage[i]+"</span></p></div>";

			if(data.musics[i].attrs.tracks){
				domStr +="<div class='album-info'><h4 class='album-song'>专辑歌曲</h4><ul class='song-list'>";
				arrTracks[i] = data.musics[i].attrs.tracks.toString();
				arrSongTemp = arrTracks[i].split("\n");

				for(var t=0;t<arrSongTemp.length;t++){
					domStr +="<li>• "+arrSongTemp[t].replace("\t","")+"</li>";
				}
				domStr +="</ul></div>";
			}
			
			
			domStr +="</div>";
			
		}
		domStr +="</div>";	
		resultCon.innerHTML = domStr;

		totalPage = Math.ceil(data.total/5); // 一页显示五个
		nowPage = Math.floor(data.start/5)+1;

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