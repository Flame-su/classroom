<template>
    <div class="vocal">
        <div class="top">
            <span class="reset" @click="reset">重来</span>
            <!--<span class="count"><i class="cur">75</i>/90</span>-->
        </div>
        <!--倒计时-->
        <div class="DelayTime" :class="{'show':isDelayShow}">
            <Delay-time :DelayTime="DelayTime"></Delay-time>
        </div>
        <audio ref="player" :src="AudioSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <audio ref="playerTape" :src="TapeSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <!--歌词-->
        <div class="lrc-list">
            <div class="lrc-box" ref="lrcBox">
                <!--<h3>{{data.name}}</h3>-->
                <div class="item" :class="curId == index?'act':''" v-for="(item,index) in allLrcData">
                    <p class="org">{{item.txt}}</p>
                    <p class="cur" ref="curLrc" :data-state="curId == index?'active':''">
                        {{item.txt}}
                    </p>
                </div>
            </div>
        </div>
        <div class="tape">
            <p class="tip">{{_TipsTxt}}</p>
            <ul v-show="!isTape">
                <li class="play" data-song="1" v-show="!isPlay">
                    <img src="../../static/image/all.png">
                </li>
                <li class="pause" data-song="1" v-show="isPlay" v-tap="{ methods : musicPause }">
                    <img :src="TAvatar">
                </li>
                <!--中间录音-->
                <li class="tape-start " v-tap="{ methods : TapeStart}"></li>
                <li class="play" :class="curChapter.section_info.done_times==0?'not':''" data-song="2" v-show="!isTapePlay" v-tap="{ methods : TapePlay}">
                    <img :src="userinfo.avatar" :alt="userinfo.nickname">
                    <div class="wp" ref="wp">
                        <div class="cover shape1"></div>
                        <div class="cover shape2"></div>
                        <div class="cover shape3"></div>
                        <div class="cover shape4"></div>
                    </div>
                </li>
                <li class="pause " data-song="2" v-show="isTapePlay " v-tap="{ methods : TapePause}">
                    <img :src="userinfo.avatar" :alt="userinfo.nickname">
                </li>
            </ul>
            <div v-show="isTape" v-tap="{ methods : TapeEnd}" class="animate">
                <Music-animat></Music-animat>
            </div>
        </div>
        <!--练习弹出tips-->
        <div class="lrc-tips" v-show="isShowTips">{{TipsTxt}}</div>
        <!--练习完成弹出tips-->
        <div class="lrc-tips bt" v-show="isShowTips2">成功完成一次练习，再接再厉加油！</div>
        <Popup :finishStatus="finishStatus" :chapterid="$route.query.chapterid" v-show="isPopupShow" :closePop="closePop"></Popup>
    </div>
</template>
<script src="./vocal.js"></script>  
<style lang="scss">
@import "./vocal.scss";
</style>
