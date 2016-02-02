(function(){
	var detail = element.byClass(".detail")[0],
		urlSearch = window.location.search,
		urlParaArr01 = urlSearch.substring(1).split('&'),
		pageId = '';
	
	for(var i=0;i<urlParaArr01.length;i++){
		var urlParaArr02 = urlParaArr01[i].split('=');
		if(urlParaArr02[0]=='pageId'){
			pageId = urlParaArr02[1];
			continue;
		}
		if(urlParaArr02[0]=='page'){
			page = urlParaArr02[1];
		}
	}

	if(urlSearch){
		var oScript = document.createElement('script');
		oScript.src = 'https://api.douban.com/v2/book/'+ pageId +'?&callback=dataFn';
		document.body.appendChild(oScript);
	}

	function dataFn(data){

		var domStr = '';
		
		domStr += "<div class='detail-summary'><div class='detail-pic'><img src='"+data.images.large+"'></div>";
		domStr += "<div class='detail-info'><h3 class='book-tit'>"+data.title+"</h3>";
		domStr += "<p class='book-author'><span class='key'>作　　者：</span><span class='val'>"+data.author+"</span></p>";
		domStr += "<p class='book-average'><span class='key'>评　　分：</span><span class='val'>"+data.rating.average+"</span></p>";
		domStr += "<p class='book-date'><span class='key'>出版日期：</span><span class='val'>"+data.pubdate+"</span></p>";
		domStr += "<p class='book-publisher'><span class='key'>出 版 社：</span><span class='val'>"+data.publisher+"</span></p>";
		domStr += "<p class='book-price'><span class='key'>价　　格：</span><span class='val'>"+data.price+"</span></p>";
		domStr += "</div></div><div class='detail-des'>";
		domStr += "<h3>书籍简介：</h3>";
		domStr += "<p>"+data.summary+"</p></div>";
		
		detail.innerHTML = domStr;

	}
	
	window.dataFn = dataFn;
	
})()
	