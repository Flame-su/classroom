<template>
  <div class="status">
    <div class="box" ref="box"></div>
  </div>
</template>

<script>
export default {
  name: 'musicanimat',
  data() {
    return {
    }
  },
  props: ['isTape'],
  mounted() {
    this.musicAnimat();
  },
  methods: {
    musicAnimat() {
      var box = this.$refs.box;
      for (var i = 0; i < 37; i++) {
        var I = document.createElement("i");
        var S = document.createElement("span");
        box.appendChild(I);
        box.appendChild(S);
      }
      var arrI = box.getElementsByTagName("i")
      var arrS = box.getElementsByTagName("span")
      for (var i = 0; i < arrS.length; i++) {
        arrS[i].style.left = (.4 * i + 0.12) + "rem";
      }
      for (var i = 0; i < arrI.length; i++) {
        arrI[i].style.left = (.4 * i) + "rem";
        arrI[i].style.background = "#fff";
        var radom = Math.random() * 1.5 + .6;
        arrI[i].style.animation = "wave " + radom + "s linear infinite";
      }
    }
  }

}
</script>

<style lang="scss">
@import '../styles/_common.scss';

.status {
  height: rem(70);
  .tip {
    font-size: rem(22);
    padding-top: rem(30);
    color: #999;
  }
  .box {
    width: 100.1%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    background-image: linear-gradient(to left, #FDC11E, #EA2AF8);
    transform: rotate(180deg);
    i,
    span {
      display: block; // height: rem(70);
      height: 100%;
      position: absolute;
      bottom: 0;
    }
    i {
      width: rem(19);
    }
    span {
      width: rem(15); // height: rem(70);
      background: #FFFFFF;
    }
  }
  @keyframes wave {
    0% {
      height: rem(8);
    }
    50% {
      height: rem(50);
    }
    100% {
      height: rem(12);
    }
  }
}
</style>
