var that;
Page({
  data:{
    // text:"这是一个页面"
    lanmu:[],
    groups:[],
    categories:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
	var url = 'http://api.liwushuo.com/v2/item_categories/tree'; //单品
	var columns = 'http://api.liwushuo.com/v2/columns';   //栏目推荐
	var groups = 'http://api.liwushuo.com/v2/channel_groups/all';  //	攻略列表
	
		//
		this.request(columns, function( res ){
			var arr = res.data.columns;
        	for( var i =0; i< arr.length; i++){
        		if( i % 3 == 0){
        			that.data.lanmu.push([]);
        		}
        		that.data.lanmu[  parseInt( i /3 ) ].push( arr[i] );
        	}
			that.setData({
				lanmu:that.data.lanmu
			})
		});
		
		//
		this.request(groups, function(res){
			console.log( res);
			that.setData({
				groups: res.data.channel_groups
			});
		} );
		
		//
		this.request(url, function(res){
			console.log( res );
			that.setData({
				categories: res.data.categories
			})
		});
  },
  onReady:function(){
    // 页面渲染完成
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
  request: function(url, back){
  		wx.request({
	         url: url,
	            header:{
	                "Content-Type":"application/json"
	            },
	            success: function(res) {
	            	back(res.data);
	            }
	      });
  }
  
})