<template>
    <div class="group">
        <audio ref="player" :src="AudioSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <audio ref="playerOrg" :src="MusicSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <audio ref="playerTape" :src="TapeSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <div v-title></div>
        <div class="top">
            <span class="reset" @click="reset">重来</span>
            <!--<span class="count"><i class="cur">75</i>/90</span>-->
        </div>
        <div class="DelayTime" :class="{'show':teacherFirst=='0' && isDelayShow}">
            <Delay-time :DelayTime="DelayTime"></Delay-time>
        </div>
        <div class="con" ref="wrapper">
            <ul class="scroll">
                <li class="item" ref="lis" :data-first="teacherFirst" v-for="(item,key,i) in allGroupLrc">
                    <div class="avatar">
                        <img v-if="teacherFirst=='1'?i%2==0:i%2!=0" :src="TAvatar">
                        <img v-else :src="userinfo.avatar">
                    </div>
                    <div class="lrc-box" v-for="v in item">
                        <p class="org">{{v.txt}}</p>
                        <p class="cur" ref="curLrc" :data-state="curId == item.id?'active':''">
                            {{v.txt}}
                        </p>
                    </div>
                </li>
            </ul>
        </div>

        <!--操作-->
        <div class="tape">
            <p class="tip">{{TipsTxt}}</p>
            <!--未开始录音-->
            <ul v-show="!isTape">
                <li class="play" data-song="1" v-show="!isPlay">
                    <img src="../../static/image/all.png" alt="">
                </li>
                <li class="pause" data-song="1" v-show="isPlay " v-tap="{ methods : musicPause }">
                    <img :src="TAvatar" alt="">
                </li>
                <!--中间录音-->
                <li class="tape-start " v-tap="{ methods : TapeStart,state:true}"></li>
                <li class="play" :class="curChapter.section_info.done_times==0?'not':''" data-song="2" v-show="!isTapePlay " v-tap="{ methods : TapePlay}">
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
            <!--开始录音-->
            <div v-show="isTape " class="status animate" v-tap="{ methods : TapeEnd,state:false }">
                <Music-animat></Music-animat>
            </div>
            <div class="lrc-tips bt" v-show="isShowTips2">成功完成一次练习，再接再厉加油！</div>
            <Popup :finishStatus="finishStatus" :chapterid="$route.query.chapterid" :closePop="closePop" v-show="isPopupShow"></Popup>
        </div>
    </div>
</template>
<script src="./group.js"></script>  
<style lang="scss">
@import "./group.scss";
</style>
