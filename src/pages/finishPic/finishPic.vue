<template>
    <div class="finishcard" ref="card" @touchmove.prevent>
        <!--<canvas id="canvas" ref="cvs"></canvas>-->
        <span>{{Nickname}}</span>
        <img :src="Pic">
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    data() {
        return {
            Pic: this.$route.query.pic,
            Nickname: this.$route.query.nickname,
            newimgsrc: ''
        }
    },
    created() {
        setTimeout(() => {
            // this.Print();
        }, 100);
    },
    methods: {
        Print() {
            var cvs = this.$refs.cvs;
            var box = this.$refs.card;
            var ctx = cvs.getContext('2d');
            var newPic = new Image();
            // newPic.crossOrigin = "anonymous";
            newPic.src = this.Pic;
            cvs.width = box.offsetWidth;
            cvs.height = box.offsetHeight;
            newPic.onload = (cvs) => {
                ctx.drawImage(newPic, 0, 0, box.offsetWidth, box.offsetHeight);
                // 设置字体样式
                ctx.font = "50px Courier New";
                //设置字体填充颜色
                ctx.fillStyle = "blank";
                ctx.textAlign = "center";
                ctx.fillText(this.Nickname, this.$refs.card.offsetWidth / 2, 100);
                this.newimgsrc = this.$refs.cvs.toDataURL("image/png");
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_common.scss';
.finishcard {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0; //background-color: #666;
    img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 998;
    }
    span {
        position: absolute;
        top: rem(270);
        left: 50%;
        font-size: rem(30);
        transform: translateX(-50%);
        z-index: 999;
    }
}
</style>
