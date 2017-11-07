<template>
	<div class="popup" @touchmove.prevent @click.stop="closePop">
		<div class="box" @click.stop>
			<p>{{finishStatus?'恭喜你完成了课程要求的全部练习,现在不是迫不及待的想一展歌喉呢？':'恭喜你完成本项内容趁热打铁进行下一项'}}</p>
			<button @click.stop="GoToRoute">{{finishStatus?'展示学习成果':'进行下一项'}}</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	//0=> 成功完成当前练习课程,1=>完成所有练习进行挑战页面
	props: {
		finishStatus: {
			default: 0
		},
		chapterid: {
			default: ''
		},

		closePop: {
			default: function() { }
		}
	},
	methods: {
		GoToRoute() {
			if (this.finishStatus) {
				//完成全部课程走课后作业				
				this.$router.push({
					path: '/Homework',
					query: {
						chapterid: this.chapterid
					}
				})
			} else {
				this.closePop();
				this.$router.push({
					path: '/Whole',
					query: {
						chapterid: this.chapterid
					}
				});
			}
		}
	}
}
</script>

<style lang="scss">
@import '../styles/_common.scss';
.popup {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 999;
	background: rgba(0, 0, 0, .8);
	.box {
		width: rem(550);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		background: #FFFFFF;
		border-radius: rem(8);
		overflow: hidden;
		padding-top: rem(50);


		p {
			font-size: rem(30);
			line-height: rem(55);
			width: rem(340);
			margin: 0 auto;
		}
		button {
			width: 100%;
			background: #FFFFff;
			color: #FF2F4C;
			border: none;
			height: rem(100);
			font-size: rem(28);
			border-top: rem(1) solid #E5E5E5;
			margin-top: rem(50);
		}
	}
}
</style>