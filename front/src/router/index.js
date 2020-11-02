import Vue from 'vue'
import VueRouter from 'vue-router'

// 공통페이지
import appHeader from '@/components/common/Header'
import appFooter from '@/components/common/Footer'

// 인트로, 홈페이지
import intro from '@/views/Intro'
import home from '@/views/Home'

// 게시판
import board from '@/components/board/board_main'
import postContent from '@/components/board/post_content'
import postRegister from '@/components/board/post_register'
import postModify from '@/components/board/post_modify'

// 유저페이지
import user from '@/views/User'
import signup from '@/components/user/Signup'
import signupSuccess from '@/components/user/SignupSuccess'
import mypage from '@/components/user/Mypage'

// 스터디페이지
import study from '@/views/Study'
import search from '@/components/study/StudyMain'
// import studydetail from '@/components/studydetail/MainStudyDetail'
import workspace from '@/components/workspace/WorkSpace'
import MyGroupList from '@/components/user/MyGroupList'

//쪽지함 접근(임시)
import msgbox from '@/components/user/messenger/MessageHome'

// 일정관리 페이지
import calendar from '@/views/Calendar'
import mycal from '@/components/calendar/MyCalendar'

// test
import studyView from '@/components/studyView/studyView'
import studyHome from '@/components/studyView/studyHome'
import studySchedule from '@/components/studyView/studySchedule'
import studyMember from '@/components/studyView/studyMember'
import studyBoard from '@/components/studyView/board_study/board'
import studyRegister from '@/components/studyView/board_study/post_register'
import studyModify from '@/components/studyView/board_study/post_modify'
import boardContents from '@/components/studyView/board_study/post_content'

// 에러 페이지
import NotFound from '@/views/NotFound'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'intro',
        components: {
            header: null,
            default: intro,
            footer: null
        }
    },
    {
        path: '/home',
        name: 'home',
        components: {
            header: appHeader,
            default: home,
            footer: appFooter,
        }
    },
    {
        path: '/study',
        name: 'study',
        components: {
            header: appHeader,
            default: study,
            footer: appFooter
        },
        children: [{
                path: 'search',
                name: 'search',
                component: search,
            },
            {
                path: 'mygroups',
                name: 'mygroups',
                component: MyGroupList,
            },
            {
                path: ':study_id',
                name: 'study_main',
                component: studyView,
                props: true,
                children: [{
                        path: 'home',
                        name: 'study_home',
                        component: studyHome,
                        props: true,
                    },
                    {
                        path: 'schedule',
                        name: 'study_schedule',
                        component: studySchedule,
                        props: true,
                    },
                    {
                        path: 'member',
                        name: 'study_member',
                        component: studyMember,
                        props: true,
                    },
                    {
                        path: 'board/register',
                        name: 'study_register',
                        component: studyRegister,
                        props: true,
                    },
                    {
                        path: 'board/modify',
                        name: 'study_modify',
                        component: studyModify,
                        props: true,
                    },
                    {
                        path: 'board/:board_name',
                        name: 'study_board',
                        component: studyBoard,
                        props: true,
                        children: [{
                            path: '?post_id=:post_id',
                            name: 'board_contents',
                            component: boardContents,
                            props: true,
                        }]
                    }
                ]

            },
        ]
    },
    {
        path: '/workspace/:study_id',
        name: 'workspace',
        components: {
            header: null,
            submain: workspace,
            footer: null
        },
    },
    {
        path: '/board/register',
        name: 'post_register',
        components: {
            header: appHeader,
            default: postRegister,
            footer: appFooter
        },
        props: true,
    },
    {
        path: '/board/modify',
        name: 'post_modify',
        components: {
            header: appHeader,
            default: postModify,
            footer: appFooter
        },
        props: true,
    },
    {
        path: '/board/:board',
        name: 'board',
        components: {
            header: appHeader,
            default: board,
            footer: appFooter,
        },
        props: true,
        children: [{
            path: '?id=:post_id',
            name: 'post_id',
            component: postContent,
            props: true,
        }]
    },
    {
        path: '/user',
        name: 'user',
        components: {
            header: appHeader,
            default: user,
            footer: appFooter
        },
        children: [{
                path: 'mypage',
                component: mypage
            },
            {
                path: 'signup',
                name: 'signup',
                component: signup
            },
            {
                path: 'signup/success',
                component: signupSuccess
            },
        ]
    },
    {
        path: '/msgbox',
        name: 'msgbox',
        components: {
            header: appHeader,
            default: msgbox,
            footer: appFooter
        }
    },
    {
        path: '/calendar',
        name: 'calendar',
        components: {
            header: appHeader,
            default: calendar,
            footer: appFooter
        },
        children: [{
            path: 'mycal',
            name: 'mycal',
            component: mycal,
        }]
    },
    {
        path: '*',
        name: 'not_found',
        components: {
            header: appHeader,
            default: NotFound,
            footer: appFooter,
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    linkExactActiveClass: "active",
    base: process.env.BASE_URL,
    routes,
    scrollBehavior() {
        return { x: 0, y: 0 }
    }
})

export default router