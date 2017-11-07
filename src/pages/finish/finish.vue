<template>
    <div class="finish" :style="bgStyle" @touchmove.prevent>
        <div class="content">
            <h3>{{data.graduation_info.title}}</h3>
            <router-link :to="{name:'FinishPic',query:{pic:data.graduation_info.diploma,nickname:userinfo.nickname}}" tag="h6">查看电子证书</router-link>
            <p>
                {{data.graduation_info.intro}}
            </p>
        </div>

        <div class="copyright">明星教室</div>
    </div>
</template>
<script src="./finish.js"></script>
<style lang="scss" scoped>
@import "./finish.scss";
</style>
