<template>
	<div class="popup">
		<div class="box">
			<p>恭喜你完成了课程要求的全部练习</p>
			<button>展示学习成果</button>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss">
	 @import '../styles/_common.scss';

	.popup{
		width: 100%;
		height: 100%;
		background: #000;
		opacity:.8;
		.box{
			width: rem(550);
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			background: #FFFFFF;
			border-radius: rem(8);
			overflow:hidden;
			padding-top:rem(50);
			
			
			p{	
				font-size:rem(30);
				line-height: rem(55);
				width: rem(280);
				margin: 0 auto;
			}
			button{
				width: 100%;
				background: #FFFFff;
				color: #FF2F4C;
				border: none;
				height: rem(100);
				font-size: rem(28);
				border-top:rem(1) solid #E5E5E5 ;
				margin-top: rem(50);
			}
		}
	}
</style>