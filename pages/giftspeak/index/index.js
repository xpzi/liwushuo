var that;
var pageStartY = 0;
var proMoveY = 0;
var timer = null;
var Refresh = require("./refresh.js");

Page({
  //refresh: refresh,
  param:{
    ispull : true,
    scrollend: true
  },
  data:{
    // text:"这是一个页面"
    swiper:{
      indicatorDots: false,
      autoplay: false,
      interval: 0,
      duration: 300
    },
    pullrefresh:false,
    pullrefreshtext:"下拉刷新",
    paddingtop:0,
    margintop:-40,
    scrollTop:0,
    indicatorDots: true,
    navdata:[],		    //nav
    navCurrent:0,
    navTextId: "navText4",
    pageList:[],
    pageCurrent:0,
   

    listData:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    // this.refresh = new Refresh(this);
    Refresh.init(this , {
    	down:{
    		url:'http://api.liwushuo.com/v2/channels/preset?gender=1&generation=1',
    		success: function( res ){
    			console.log( 'down',res );
    		}
    	},
    	up:{
    		url:'http://api.liwushuo.com/v2/channels/100/items_v2?ad=2&gender=1&generation=1&limit=20&offset=0',
    		success: function( res ){
    			console.log( 'up',res );
    		}
    	}
    });
    console.log( 'aaa' );
    
    var url = {
    	nav: 'http://api.liwushuo.com/v2/channels/preset?gender=1&generation=1',
    	banner:"http://api.liwushuo.com/v2/banners"
    }
    
  	  
    
    //请求分类的  nav
    wx.request({
         url: url.nav,
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
            	
              var data = res.data.data.candidates;

              console.log( data );
              data.unshift({
                    editable: true,
                    id: 100,
                    name: '精选',
                    url: ""
              });

              // 初始化页面列表数据。就这样 ，数据分开显示
              for(var i =0; i<  data.length ; i++){
              		that.data.pageList.push({
              			id:data[i].id,
              			page:1,
              			isinit: false,
              			data:[]
              		});
              }
						
            // 设置 导航
              that.setData({
                navdata : data
              });
              
              //  请求页面数据
							that.requerListContent( that.data.pageCurrent );
            }
      });
      
     //获取banner图信息
      wx.request({
         url: url.banner,
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
            	var arr = res.data.data.banners;
            	that.setData({banner:arr});
            }
      });
    
   
  
  },
  pageSwiper:function(e){
    var index = parseInt(e.currentTarget.dataset.item )
	  console.log(index);
    this.requerListContent( index);
    this.setData({
      navCurrent: index,
      pageCurrent:index,
      navTextId:'navText'+index
    });
  },
  // pagelist 切换 事件
  swiperchang: function( e ){
      // console.log( e.detail);
      var index = e.detail.current ;

      this.requerListContent(index);
      this.setData({
      navCurrent: index,
      pageCurrent:index,
      navTextId:'navText'+index
    });
  },
  requerListContent: function( index ){
// 加载数据
    var pro = index - 1;
    var next = index + 1;

    that.requerPageList(index)
    pro <= -1 || that.requerPageList(pro);
    next >= this.data.pageList.length || that.requerPageList(next);

  },
  requerPageList: function( index , more){

  		var url;
        var objData = this.data.pageList[index];
       	if(objData.isinit && !more) return;
         
        objData.isinit = true;
    	url = 'http://api.liwushuo.com/v2/channels/'+ objData.id+'/items_v2?gender=1&limit=20&offset='+((objData.page-1)*20)+'&generation=1';

    	wx.request({
         url: url,
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
            	console.log( res.data.data );
            	
              var data = res.data.data.items;
              that.data.pageList[index].data = data;
              that.data.pageList[index].page++;
              that.setData({
                pageList : that.data.pageList
              });
            }
      });
  },
  navigateTo: function( e ){
  		
	  wx.navigateTo({
	    url: 'content?id=' + e.currentTarget.dataset.id
	  })
  }
  
	
});



/*
var that;
var pageStartY = 0;
var proMoveY = 0;
var timer = null;

var Refresh = require("./refresh.js");

Page({
  param:{
    ispull : true,
    scrollend: true
  },
  data:{
    // text:"这是一个页面"
    swiper:{
      indicatorDots: false,
      autoplay: false,
      interval: 0,
      duration: 300
    },
    pullrefresh:false,
    pullrefreshtext:"下拉刷新",
    paddingtop:0,
    margintop:-40,
    scrollTop:0,
    navdata:[],
    pageList:[],
    listData:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    console.log( 'aaa' );
    //请求分类的  nav
    wx.request({
         url: 'http://api.liwushuo.com/v2/channels/preset?gender=1&generation=1',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
              var data = res.data;
              that.param.navlist = data.data.candidates;
              that.setData({
                navdata : that.param.navlist,
                pageList: [that.param.navlist[0]]
              });
            }
      });
    
    // list 特色
     wx.request({
         url: 'http://api.liwushuo.com/v2/channels/100/items_v2?ad=2&gender=1&generation=1&limit=20&offset=0',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
              var data = res.data.data.items;
              that.setData({
                listData : data
              });
            }
      });
  },
  pageSwiper:function(e){
	  console.log(e);
  },
  listScroll:function(e){

     this.param.ispull = e.detail.scrollTop < 10 ? true  : false;
     if(!this.param.ispull){
        that.setData({
              margintop:-40
        });
     }else{
       this.param.scrollend = true;
     }
     console.log( e.detail.scrollTop , "scroll", this.param.ispull );
  },
  listScrollToupper:function(){
      // this.param.ispull = true;
  },
  listScrollTouchStart:function(e){
      pageStartY = e.touches[0].clientY;
      console.log(pageStartY, "statr");
      this.param.touchend = false;
      this.param.scrollend = false;
  },
  listScrollTouchMove: function(e){

    if(!this.param.ispull ||  this.data.margintop > -40 ){
        this.param.ispull = true;
    }    

    if( this.param.ispull ){

      if( this.data.margintop >= 0  ){
        this.setData({
          pullrefreshtext:'松开刷新'
        });
      }else{
        this.setData({
          pullrefreshtext:'下拉刷新'
        });
      }

        var   dy = parseInt( ( e.touches[0].clientY -pageStartY)/1);
        console.log(e.touches[0].clientY, "move");
        // console.log(dy);
        this.setData({
          margintop:  -40 + dy //this.data.margintop + dY
        });
        this.param.scrollend = true;
    }


  },
  listScrollTouchEnd:function(){

    console.log( 'end');
    this.param.touchend = true;
    
    if( !this.param.ispull ) return;

    this.param.ispull = false;
    if(this.data.margintop < 0){
        //刷新页面

    }
    clearInterval(timer);
    timer = setInterval(function(  ){
        if(that.param.scrollend){
            var newmargintop = parseInt( (that.data.margintop + 40) - (that.data.margintop+40) *1/9);
            if( newmargintop <= 1){
                clearInterval(timer);
                that.setData({
                      margintop:-40
                });
                that.param.ispull = true;
            }else{
                that.setData({
                      margintop: newmargintop-40
                });
            }
        }

    },10);   

     

    
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

})

 */