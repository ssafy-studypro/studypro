import Kakao from './kakao.min.js'

const signin_callback = function () {
    return new Promise((resolve, reject) => {
        Kakao.API.request({
            url: "/v2/user/me",
            success: async function (res) {
                resolve(res);
            },
            fail: function (err) {
                reject(err);
            }
        });

    })
}

const signin = function () {
    return new Promise((resolve, reject) => {
        Kakao.Auth.loginForm({
            success: async (/*authObj*/) => {
                const user_info = await signin_callback();
                resolve(user_info);
            },
            fail: (err) => {
                reject(err);
            },
            scope: "profile,account_email,gender"
        })
    })
}

const WbKakao = {
    init: () => {
        Kakao.init("abcf1485814ecadfca6ac4f572c55b43")
    },

    signinForm: async () => {
        const user_info = await signin();
        return user_info;
    },

    signout: () => {
        Kakao.Auth.cleanup();
        return Kakao.Auth.logout();
    }

}

export default WbKakao;

