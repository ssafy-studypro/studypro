import axios from "axios";
import AuthHeader from "./auth.header";

const URL = process.env.VUE_APP_API_URL + "users/";

class AuthService {
  // 초기 유저 정보업데이트
  checkUserDefault() {
    AuthHeader.changeHeadersToken();
    return axios
      .post(URL + "token")
      .then(this.handleResponse)
      .then((res) => {
        AuthHeader.changeHeadersToken();
        if (res.data.user) {
          this.setToken(res.data.user);
          return res.data.user;
        } else {
          return {};
        }
      });
  }

  // 로그인
  login(user) {
    return axios
      .post(URL + "signin", {
        email: user.email,
        password: user.password,
      })
      .then(this.handleResponse)
      .then((response) => {
        if (response.data.state === "success") {
          this.setToken(response.data.user);
          AuthHeader.changeHeadersToken();
          return response.data.user;
        } else {
          return response.data.user;
        }
      });
  }

  socialLogin(user) {
    console.log("DD", user);
    console.log(URL + "social-signin");
    return axios
      .post(URL + "social-signin", {
        email: user.email,
        nickname: user.nickname,
        gender: user.gender,
        profile_image: user.profile_image,
        platform_type: user.platform,
      })
      .then(this.handleResponse)
      .then((response) => {
        console.log(response);
        if (response.data.state === "success") {
          this.setToken(response.data.user);
          AuthHeader.changeHeadersToken();
          return response.data.user;
        } else {
          return response.data.user;
        }
      });
  }

  // 로그아웃
  logout() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }

  register(formData) {
    return axios.post(URL + "signup", formData).then((res) => {
      console.log(res.data);
      if (res.data.state == "success") {
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.data);
      }
    });
  }

  // 응답에 에러가 있으면 로그아웃 시킨다.
  handleResponse(response) {
    if (response.status === 401) {
      this.logout();
      location.reload(true);

      const error = response.data.state;
      return Promise.reject(error);
    }

    return Promise.resolve(response);
  }

  setToken(user) {
    if (user.loginRemain) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }
}

export default new AuthService();
