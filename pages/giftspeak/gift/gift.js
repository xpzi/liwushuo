var that;
Page({
	data: {
		nav:['每日推荐', 'TOP100', '独立原创榜','新星榜'],
		navindex: 0,
		content: []
	},
	onLoad:function(options){
	// 页面初始化 options为页面跳转所带来的参数
		that = this;
		for(var i =0 ; i < this.data.nav.length; i++){
			this.data.content.push({
				data:[],
				isinit:false,
				page:1,
				cover_image:''
			});
		}
		this.requestData( 0, 1);
	},
	onReady:function(){
	// 页面渲染完成
		console.log('----------');
	  
		// 设置标题  
		wx.setNavigationBarTitle({
			title:'礼物榜'
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
	navTap: function( e ){
//		console.log( e );
		var index =  parseInt( e.currentTarget.dataset.item);
		this.requestData( index, 1 );
	},
	bindchange:function(e){
//		console.log( e );
//		console.log( e.detail.current );
		var index = e.detail.current;
		this.requestData( index, 1 );
	},
	requestData: function( index , page){
		
		if( this.data.content[index].isinit){
			if( page == 0){
				//page == 0 表示下拉刷新
				page = 1;
			} else if(page == this.data.content[index].page ){
				//相等表示滑动到底部加载更多数据
				this.data.content[index].page =  ++page;
			}else{
				
				that.setData({
					navindex: index
				});
				return ;  // 如果初始化过的，就不再加载数据了
			}
		}
		this.data.content[index].isinit = true;
		var src = 'http://api.liwushuo.com/v2/ranks_v2/ranks/'+ (index+1) +'?limit=20&offset=' + ((1 -1)*20);
		
		wx.request({
			url: src,
			header:{
				"Content-Type":"application/json"
			},
			success: function(res) {

				that.data.content[index].data = res.data.data.items;
				that.data.content[index].cover_image = res.data.data.cover_image;
				that.setData({
					content: that.data.content,
					navindex: index
				});
			}
		});
	}
})
