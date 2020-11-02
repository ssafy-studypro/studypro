<template>
    <v-row>
        <v-col cols="12 pa-0">
            <mini-signin v-if="!isAuth"/>
            <mini-user-info v-else/>
        </v-col>
    </v-row>
</template>

<script>

export default {
    components: {
        MiniSignin: () => import('@/components/user/MiniSignin'),
        MiniUserInfo: () => import('@/components/user/MiniUserInfo')
    },
    computed: {
        isAuth(){
            return this.$store.getters['auth/isAuth']
        }
    },
}
</script>