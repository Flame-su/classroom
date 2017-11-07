<template>
    <div class="task">
        <audio ref="player" class="player" :src="$route.query.music">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>

        <div class="top">
            <span class="toggle">
                <input type="button" value="重来" v-show="isTape" @click="reset" />
            </span>
            <!--<span class="count"><i class="cur">75</i>/90</span>-->
        </div>
        <!--倒计时-->
        <div class="DelayTime" :class="{'show':isDelayShow}">
            <Delay-time :DelayTime="DelayTime"></Delay-time>
        </div>
        <!--歌词-->
        <div class="lrc-list">
        <!--倒计时-->
            <div class="lrc-box" ref="lrcBox">
                <!-- <h3>{{data.name}}</h3>-->
                <!--<h5>梅畅</h5>-->
                <div class="item" :class="curId == index?'act':''" v-for="(item,index) in allLrcData">
                    <p class="org">{{item.txt}}</p>
                    <p class="cur" ref="curLrc" :data-state="curId == index?'active':''">
                        {{item.txt}}
                    </p>
                </div>
            </div>
        </div>

        <div class="tape" v-show="!isMuiscOver">
             <p class="tip">{{!isTape?'点击按钮 开始录音':'点击波纹 结束录音'}}</p>
            <ul v-show="!isTape">
                <li class="tape-start" v-tap="{ methods : TapeStart_loacl}"></li>
            </ul>
            <div v-show="isTape" @click="TapeEnd_loacl" class="animate">
                <Music-animat></Music-animat>
            </div>
        </div>

        <!--上传操作-->
        <div class="pushwork" v-show="isMuiscOver">
            <span @click="reset"  ref="reset">重来</span>
            <span @click="upload"  ref="upload">提交</span>
        </div>
        <div class="mask" v-if="!mask"></div>
        <!--上传动画状态-->
        <Per v-if="isUpload"></Per>
    </div>
</template>
<script src="./task.js"></script>  
<style lang="scss">
@import "./task.scss";
</style>
