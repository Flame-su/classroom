<template>
	<div class="action">
		<div class="box">
			<img src="../static/image/1.png" alt="" class="img-title" />
			<p class="tltle-txt">梅畅老师建议你本段练习3遍哦~</p>
			<ul>
				<li><img src="../static/image/2.png" alt="" />
					<div>
						<p>表示有效视频可播放试听</p>
					</div>
				</li>
				<li><img src="../static/image/3.png" alt="" />
					<div>
						<p>表示唱的不对</br>或没有录入有效录音</p>
					</div>
				</li>
			</ul>
			<div style="clear: both;">

			</div>
		</div>
		<div class="x">
			<img src="../static/image/x.png" />
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped>
@import '../styles/_common.scss';
.action {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .6);
	position: fixed;
	left: 0;
	top: 0;
	.box {
		position: absolute;
		width: rem(530);
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		background: #FFFFFF;
		border-radius: rem(8);
		padding-top: rem(60);
		.img-title {
			width: rem(100);
			height: rem(100);
			border-radius: 50%;
			vertical-align: bottom;
		}
		.tltle-txt {
			width: rem(280);
			font-size: rem(30);
			font-weight: bold;
			margin: 0 auto;
			margin-top: rem(40);
			margin-bottom: rem(85);
		}
		ul {
			width: 100%;
			padding: 0 rem(50) rem(10);
			li {
				margin-bottom: rem(50);
				font-size: rem(25);
				display: flex;
				justify-content: space-between;
				text-align: left;
				img {
					width: rem(80);
					height: rem(80);
				}
				div {
					display: flex;
					align-items: center;
				}
				p {
					width: rem(320);
				}
			}
		}
	}
	.x {
		width: rem(80);
		height: rem(80);
		position: fixed;
		bottom: rem(180);
		left: 50%;
		margin-left: rem(-40);
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>