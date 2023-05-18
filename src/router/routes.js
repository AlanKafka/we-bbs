import {createRouter, createWebHashHistory} from "vue-router";
import UserLoginPage from "../pages/UserLoginPage.vue"
import UserRegisterPage from "../pages/UserRegisterPage.vue"
import Home from '../views/Home.vue'
import Front from '../views/Front.vue'
import Backend from '../views/Backend.vue'
import Collect from '../views/Collect.vue'
import Main from '../views/Main.vue'
import ArticleContent from '../pages/ArticleContent.vue'
import HomeArticleListHot from '../pages/HomeArticleListHot.vue'
import HomeArticleListTime from '../pages/HomeArticleListTime.vue'
import FrontArticleListHot from '../pages/FrontArticleListHot.vue'
import FrontArticleListTime from '../pages/FrontArticleListTime.vue'
import BackendArticleListHot from '../pages/BackendArticleListHot.vue'
import BackendArticleListTime from '../pages/BackendArticleListTime.vue'
import CollectArticleListHot from '../pages/CollectArticleListHot.vue'
import CollectArticleListTime from '../pages/CollectArticleListTime.vue'
import UserProfile from '../components/UserProfile.vue'
import NewPostArticle from '../pages/NewPostArticle.vue'
import {message} from "ant-design-vue";
import instance from "../axios/myAxios.js";
const routes = [
    {
        path: '/', component: Main,
        children: [
            {path: '', redirect: '/home'},
            {path: '/home', redirect: '/home/hot'},
            {
                path: 'home', component: Home,
                children: [
                    {path: 'hot', component: HomeArticleListHot},
                    {path: 'time', component: HomeArticleListTime}
                ]
            },

            {path: '/front', redirect: '/front/hot'},
            {
                path: 'front', component: Front,
                children: [
                    {path: 'hot', component: FrontArticleListHot},
                    {path: 'time', component: FrontArticleListTime}
                ]
            },
            {path: '/backend', redirect: '/backend/hot'},
            {
                path: 'backend', component: Backend,
                children: [
                    {path: 'hot', component: BackendArticleListHot},
                    {path: 'time', component: BackendArticleListTime}
                ]
            },
            {path: '/collect', redirect: '/collect/hot'},
            {
                path: 'collect', component: Collect,
                children: [
                    {path: 'hot', component: CollectArticleListHot},
                    {path: 'time', component: CollectArticleListTime}
                ]
            },
            {
                path: 'article', component: ArticleContent
            },
            {
                path:'/user/personal',

                component: UserProfile,
                beforeEnter:async (to,from,next)=>{
                    if(to.name !='userLogin'){
                        await instance.request({
                            url:'/user/authentication',
                            method:'get',
                        }).then(res=>{
                            if(res.code === 40100){
                                message.error("请先登录")
                                next('/user/login')
                            }
                            if(res.code === 200){
                                next()
                            }
                        }).catch(error=>{
                            next('/user/login')
                        })
                    }
                }
            },
        ],

    },
    {path: '/user/login', name:'userLogin',component: UserLoginPage},
    {path: '/user/register', component: UserRegisterPage},
    {path: '/user/newArticle',component: NewPostArticle},

]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写

})


export default router;