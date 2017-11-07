<template>
    <div class="out-time">
        <ul class="flag">
            <li :class="{ 'used':DelayTime <=0 } "></li>
            <li :class="{ 'used':DelayTime <=1 } "></li>
            <li :class="{ 'used':DelayTime <=2 } "></li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['DelayTime'],
    methods: {

    }
}
</script>
<style lang="scss" scoped>
@import '../../styles/_common.scss';
.out-time {
    width: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    .flag {
        width: rem(80);
        display: flex;
        justify-content: space-between;
        padding: rem(40) 0 0;
        li {
            width: rem(16);
            height: rem(16);
            border-radius: 50%;
            background-color: rgb(253, 205, 204);
            &.used {
                // background-color: rgb(255, 88, 87);
                visibility: hidden;
            }
        }
    }
}
</style>
