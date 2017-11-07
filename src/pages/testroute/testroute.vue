<template>
    <div>
    </div>
</template>
<script>
export default {
    created() {
        this.$router.push({
            path: this.$route.query.section_type == 1 ? '/vocal' : '/Group',
            query: {
                chapterid: this.$route.query.chapterid,
                sectionid: this.$route.query.sectionid,
                section_type: this.$route.query.section_type,
                lrcUrl: this.$route.query.lrcUrl
            }
        });
    }
}
</script>
<style lang="scss">

</style>
