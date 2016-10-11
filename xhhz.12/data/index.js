/*封装$*/
	window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems.length==0?null:elems.length==1?elems[0]:elems;
}
window.addEventListener("load",function(){slider.init()});
/*广告图片数组*/
var imgs=[
    {"i":0,"img":"img/images/index-1.jpg"},
    {"i":1,"img":"img/images/index-2.jpg"},
    {"i":2,"img":"img/images/index-3.jpg"},
    {"i":3,"img":"img/images/index-4.jpg"},
//    {"i":4,"img":"images/index/banner_05.jpg"},
];
var slider={
	LIWIDTH:730,//保存每个li的宽度
	distance:0,//保存本次移动的总距离
	DURATION:1000,//保存本次移动的总时间
	STEPS:100,//保存本次移动的总步数
	moved:0,//保存本次移动的步数，控制动画停止
	step:0,//保存每一步的长度
	INTERVAL:0,//保存每一步的时间间隔
	timer:null,//保存当前正在播放的动画的序号，专用于停止
	WAIT:3000,//每次自动轮播之间等待的时间
	canAuto:true,//是否可以自动轮播
	init:function(){
		this.INTERVAL=this.DURATION/this.STEPS;
		this.updateView();//刷新页面
		var me=this;
		$("#idxs").addEventListener("mouseover",function(e){
			if(e.target.nodeName=="LI"&&e.target.className!="hover"){
				var starti=$("#idxs>.hover").innerHTML;
				var endi=e.target.innerHTML;
				me.move(endi-starti);
			}
		});
		$("#nav_ad_img").addEventListener("mouseover",function(){
				me.canAuto=false;
			});
		$("#nav_ad_img").addEventListener("mouseout",function(){
				me.canAuto=true;
			});
		this.autoMove();//启动自动轮播
	},
	autoMove:function(){
		var me=this;
		this.timer=setTimeout(function(){
			if(me.canAuto){
			me.move(1);}else{me.autoMove;}
			},this.WAIT);
	},
	move:function(n){//将imgs的ul左移或右移
		if(this.timer!=null){//有动画在运行，停止
			clearTimeout(this.timer);
			this.timer=null;
			this.moved=0;
			$("#imgs").style.left="";
		}
		this.distance=n*this.LIWIDTH;
		this.step=this.distance/this.STEPS;
		if(n<0){//右移之前提前调整数组内容
			var dels=imgs.splice(imgs.length+n,-n);
			Array.prototype.unshift.apply(imgs,dels);
			$("#imgs").style.left=n*this.LIWIDTH+"px";
			this.updateView();
		}
		this.timer=setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
	},
	moveStep:function(n){//让imgs的ul移动一步
		var left=parseFloat(getComputedStyle($("#imgs")).left);
		$("#imgs").style.left=left-this.step+"px";
		this.moved++;
		if(this.moved<this.STEPS){
			this.timer=setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
		}
		else{
			clearTimeout(this.timer);
			this.timer=null;
			this.moved=0;
			if(n>0)
			{	
				var dels=imgs.splice(0,n);
				Array.prototype.push.apply(imgs,dels);
				this.updateView();
			}
			$("#imgs").style.left="";
			this.autoMove();//启动自动轮播
		}
	},
	updateView:function(){
		$("#imgs").width=(this.LIWIDTH*imgs.length);
		for (var i=0,strImg="",strIdx="";i<imgs.length;i++ )
		{
			strImg+="<li><img src='"+imgs[i].img+"'></li>";
			strIdx+="<li>"+(i+1)+"</li>";
		}
		$("#imgs").innerHTML=strImg;
		$("#idxs").innerHTML=strIdx;
		$("#idxs>li")[imgs[0].i].className="hover";	
	},
}