var that;
Page({
  data:{
    // text:"这是一个页面"
    conten:{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    var url = 'http://api.liwushuo.com/v2/posts_v2/'+ options.id ;
	this.request(url , function(res){
		console.log( res );
		
		var html = res.data.content_html;
		var arr = html.match(/<p>.*<\/p>/g);
		var reg = /<img/;
		for(var i =0 ; i< arr.length; i++){
			var o = {};
			if( reg.test(arr[i])){
				o.type = "image";
				arr[i] = arr[i].match(/src=\".*w720\"/);
				o.text = arr[i][0].substring(5, arr[i][0].length -1);
			} else if((/(div|span)/).test(arr[i])){
				o.type = "html";
				o.text = arr[i];
			}else{
				o.type = "text";
				o.text = arr[i].substring(3, arr[i].length -4);
			}
			arr[i] = o;
		}
		res.data.html = arr;
		
//		console.log(arr );
		
		that.setData({
			conten: res.data
		});
		
		
		 wx.setNavigationBarTitle({
	    	title: that.data.conten.title
	    });
	})

  },
  onReady:function(){
    // 页面渲染完成
	 wx.setNavigationBarTitle({
	    	title: that.data.conten.title
	    });
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  request: function(url, call){
  	wx.request({
         url: url,
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
            	call(res.data);
            }	
      });
  }
})