<template>
	<div class="per">
		<div class="animate">
			<ul class="top" ref="top">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
			<ul class="footer" ref="footer">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>

		</div>
		<p>
			<span ref="sum">0</span>%正在上传作业...
		</p>
	</div>
</template>

<script>
import Vue from 'vue';
export default {
	data() {
		return {
		}
	},
	methods: {
		musicAnimat() {
			var top = this.$refs.top
			var footer = this.$refs.footer
			var sum = this.$refs.sum
			var arrI = top.getElementsByTagName("li")
			var arrT = footer.getElementsByTagName("li")
			for (var i = 0; i < arrI.length; i++) {
				if (i == 0 || i == 4) {
					arrI[i].style.animation = "wave 1s linear infinite";
					arrT[i].style.animation = "wave 1s linear infinite";
				} else if (i == 2) {
					arrI[i].style.animation = "two 1s linear infinite";
					arrT[i].style.animation = "two 1s linear infinite";
				}
			}
			var timer = setInterval(function() {
				++sum.innerHTML
				if (sum.innerText >= 100) {
					clearInterval(timer)
					//停止
					for (var i = 0; i < arrI.length; i++) {
						arrI[i].style.animationPlayState = "paused"
						arrT[i].style.animationPlayState = "paused"
					}

				}

			}, 50);
		}
	},
	mounted() {
		this.musicAnimat()
	}
}
</script>

<style lang="scss">
@import '../styles/_common.scss';

.per {
	width: rem(390);
	padding: rem(40) 0;
	background: #000;
	opacity: .8;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: rem(-105);
	margin-left: rem(-195);
	border-radius: rem(14);
	.animate {
		width: 100%;
		height: rem(70);
		position: relative;

		.top {
			position: absolute;
			width: rem(86);
			top: 0;
			left: 50%;
			height: rem(35);
			margin-left: rem(-43);
			display: flex;
			justify-content: space-between;
			transform: rotate(180deg);
			padding: 0;
			li {
				float: left;
				width: rem(6);
				border-radius: 0 0 rem(3) rem(3);
				height: rem(25);
				background: #fff;
			}
			li:nth-child(1) {
				background: #ec17ff;
			}
			li:nth-child(2) {
				background: #f733cb;
			}
			li:nth-child(3) {
				background: #fa5857;
			}
			li:nth-child(4) {
				background: #fd9c34;
			}
			li:nth-child(5) {
				background: #fec21d;
			}
		}
		.footer {
			position: absolute;
			width: rem(86);
			bottom: rem(1);
			left: 50%;
			height: rem(35);
			margin-left: rem(-43);
			display: flex;
			justify-content: space-between;
			li {
				float: left;
				width: rem(6);
				border-radius: 0 0 rem(3) rem(3);
				height: rem(25);
				background: #fff;
			}
			li:nth-child(1) {
				background: #fec21d;
			}
			li:nth-child(2) {
				background: #fd9c34;
			}
			li:nth-child(3) {
				background: #fa5857;
			}
			li:nth-child(4) {
				background: #f733cb;
			}
			li:nth-child(5) {
				background: #ec17ff;
			}
		}
	}
	P {
		margin-top: rem(24);
		text-align: center;
		font-size: rem(28);
		color: #FFFFFF
	}
}

@keyframes wave {
	0% {
		height: rem(15)
	}
	50% {
		height: rem(35)
	}
	100% {
		height: rem(15)
	}
}

@keyframes two {
	0% {
		height: rem(35)
	}
	50% {
		height: rem(15)
	}
	100% {
		height: rem(35)
	}
}

.pause {
	animation-play-state: paused;
}
</style>