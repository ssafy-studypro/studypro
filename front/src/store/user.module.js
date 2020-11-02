import UserService from '@/services/user.service'

export const user = {
    actions: {
        async getUserContent({ dummy }, uid) {
            console.log('getUserContent in user.module.js', dummy)
            var user = await UserService.getUserContent(uid)
                .then(res => {
                    return res
                })
            return user
        },

        async updateUser({ dummy }, payload) {
            console.log('updateUser in user.module.js', dummy)
            return await UserService.updateUser(payload)
        },

        async chagnePass({ dummy }, payload) {
            console.log('changePass in user.module.js', dummy)
            return await UserService.chagnePass(payload)
        }
    }
}