<template>
	<div class="last">
		<div class="graduate">
			<img src="../static/image/last.png"/>
			<div class="photo">
				<img src="../static/image/14081316462626.png" alt="" />
			</div>
			<div class="content">
				<h3>完成全课程</h3>
				<p><b>苗苗</b>同学超赞的，在<span></span>老师的悉心教导下，会学《<span>小幸运</span>》这首歌，特此嘉奖!</p>
				<h4><p>明星教室</p><span></span></h4>
			</div>
			<div class="seal">
			</div>
		</div>
		<button>
			保存到相册
		</button>
	</div>
</template>

<script>
</script>

<style lang="scss">
	@import '../styles/_common.scss';
	.last {
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.3);
		.graduate{
			position:absolute;
			width:rem(550);
			height:rem(740);
			left:50%;
			top:50%;
			margin-left:rem(-275);
			margin-top:rem(-420);
			background:#ffffff;
   			border-radius: 10px;
			overflow:hidden;
			img{
				width: 100%;
				height: rem(260);
				vertical-align: bottom;
			}
			.photo{
				width: rem(80);
				height: rem(80);
				border: rem(2) solid #FFFFFF;
				border-radius: 50%;
				overflow: hidden;
				position: absolute;
				left: rem(38);
				top:rem(220);
				img{
					width: 100%;
					height: 100%;
				}
			}
			.content{
				width: 100%;
				padding:rem(75) rem(55) rem(25);
				box-sizing: border-box;
				height: rem(480);
				text-align: center;
				h3{
					font-size:rem(40);
					margin-bottom: rem(30);
				}
				p{
					font-size: rem(28);
					line-height: rem(50);
					text-align: left;
					color: #666666;
					b{
						font-size: rem(32);
						color: #000000;
					}
					margin-bottom:rem(120);
				}
				h4{
					p{width: rem(140);
					margin: 0 auto;
					font-size: rem(22);
					color: #CCCCCC;
					text-align: center;
					position: relative;
					background: #FFFFFF;
					z-index: 100;}
					span{
						position: absolute;
						width:rem(250);
						height: rem(1);
						background:#CCCCCC;
						top: 96.5%;
						left: rem(325);
						margin-left: rem(-170);
						z-index: 1;
					}
				}
				
			}
			.seal{
				width: rem(110);
				height: rem(110);
				background: url(../static/image/zhang.png);
				background-size: cover;
				position: absolute;
				bottom: rem(30);
				right: rem(35);
			}
		}
		button{
			width: rem(380);
			height: rem(90);
			border:none;
			border-radius: rem(45);
			position: fixed;
         	 background-image: linear-gradient(to left, #fa5857, #fd6969);
         	 font-size: rem(36);
         	 color: #FFFFFF;
         	 left: 50%;
         	 margin-left: rem(-190);
         	 bottom: rem(90);
		}
	}
</style>