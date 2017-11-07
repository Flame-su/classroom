<template>
    <div class="singing">

        <audio ref="player" :src="AudioSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <audio ref="playerOrg" :src="MusicSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <audio ref="playerTape" :src="TapeSrc">您的浏览器不支持audio属性，请更换浏览器在进行浏览</audio>
        <div class="top">
            <span class="toggle">
                <input class="mui-switch mui-switch-anim" type="checkbox" v-model="isDelay" @click="DelayTime = 3"> 倒数开关
            </span>
            <!--<span class="count"> <i class="cur">75</i>/90</span>-->
        </div>

        <div class="song-lists" ref="wrapper">
            <ul ref="song">
                <li class="items" v-for="(item,i) in data.section_list">
                    <!-- //卡片类型: 1.伴唱 2:对唱 3.读词 4.提示 5.视频 -->
                    <!--对唱练习前往Task路由-->
                    <div class="tips" v-if="item.section_type ==4">
                        <div class="d-tips">
                            <span class="title-img">
                                <img :src="TAvatar">
                            </span>
                            <h6> {{item.section_info.intro}}</h6>
                        </div>
                    </div>
                    <!--2:练习片段-->
                    <div class="test" v-if="item.section_type ==1  ||item.section_type ==3">

                        <div class="con" ref="con" v-if="curGroupID==i">
                            <!--头像-->
                            <div class="avatar">
                                <img :src="TAvatar">
                                <div class="delay-time">
                                	<Delay-time :DelayTime="DelayTime" v-show="isDelayShow && curSectionType!=3"></Delay-time>                          
                                </div>
                            </div>
                            	
                            <!--歌词-->
                            <div class="lrc">
                                <div class="item" v-for="v in item.section_info.lrc.lrcs" v-if="v">
                                    <p class="org">{{v|formatTrc}}</p>
                                    <p class="cur" ref="curLrc" :data-state="curId == item.id?'active':''">
                                        {{v|formatTrc}}
                                    </p>
                                </div>
                            </div>
                            <!--操作-->
                            <div class="tape">
                                <p class="tip">{{TipsTxt}}</p>
                                <!--未开始录音-->
                                <ul v-if="!isTape">
                                    <li class="play" data-song="1" v-show="!isPlay" v-tap="{ methods : musicPlay,item }">
                                        <img :src="TAvatar">
                                    </li>
                                    <li class="pause" data-song="1" v-show="isPlay " v-tap="{ methods : musicPause,item }">
                                        <img :src="TAvatar">
                                    </li>
                                    <!--中间录音-->
                                    <li class="tape-start " v-tap="{ methods : TapeStart,state:true,item,id:i}"></li>

                                    <li class="play" :class="item.section_info.done_times==0?'not':''" data-song="2" v-show="!isTapePlay " v-tap="{ methods : TapePlay,item}">
                                        <img :src="userinfo.avatar" :alt="userinfo.nickname">
                                        <!--<img src="../../static/image/1.jpg">-->
                                        <div class="wp" ref="wp">
                                            <div class="cover shape1"></div>
                                            <div class="cover shape2"></div>
                                            <div class="cover shape3"></div>
                                            <div class="cover shape4"></div>
                                        </div>
                                    </li>
                                    <li class="pause" data-song="2" v-show="isTapePlay " v-tap="{ methods : TapePause,item}">
                                        <!--<img src="../../static/image/1.jpg">-->
                                        <img :src="userinfo.avatar" :alt="userinfo.nickname">
                                        <div class="wp" ref="wp">
                                            <div class="cover shape1"></div>
                                            <div class="cover shape2"></div>
                                            <div class="cover shape3"></div>
                                            <div class="cover shape4"></div>
                                        </div>
                                    </li>
                                </ul>
                                <!--开始录音-->
                                <div v-show="isTape " class="status" v-tap="{ methods : TapeEnd,item,state:false ,id:i}">
                                    <Music-animat></Music-animat>
                                </div>
                                <p class="count">
                                    <span class="cur">{{item.section_info.seq}}</span> / {{data.total_sections}}</p>
                            </div>
                        </div>
                        <div class="lrcs" ref="lrcs" v-else v-tap="{methods:toggleGroup,index:i,item} ">
                            <p v-for="v in item.section_info.lrc.lrcs">{{v|formatTrc}}</p>
                            <div class="mark" v-if="item.section_info.done_times > 0 ">
                                <span>{{item.section_info.done_times>=item.section_info.times?item.section_info.times:item.section_info.done_times}}</span>/{{item.section_info.times}}</div>
                        </div>
                    </div>
                    <!--3:视频讲解-->
                    <div class="tips" v-if="item.section_type ==5">
                        <div class="v-tips">
                            <pre>{{item.section_info.intro}}</pre>
                        </div>
                        <div class="video" v-tap="{methods:playVideo,item}" :class=" { 'wait':!isVPlay} ">
                            <video controls x5-playsinline webkit-playsinline playsinline :ref="'video'+item.sectionid" :src="item.section_info.video" :poster="item.section_info.img">您的浏览器不支持video属性，请更换浏览器在进行浏览</video>
                        </div>
                    </div>
                </li>
                <!--课后作业-->
                <div class="btn default-btn" v-tap="{methods:toWork}">
                    课后作业
                </div>
            </ul>
        </div>
        <!--录音提示-->
        <voice-toast v-if="voiceToast" @click.native.stop="voiceToast =false"></voice-toast>

    </div>
</template>
<script src="./Singing.js"></script>
<style lang="scss">
@import "./Singing.scss";
.delay-time{
    height:rem(22)
    }
</style>
