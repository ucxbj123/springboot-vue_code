import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const systemRouter = 
    {
        path: '/system',
        name: 'System',
        component: Layout,
        meta: { title: '系统管理', icon: 'el-icon-s-home', roles: ['admin'] },
        children:[
            {
                path: 'userLists',
                name: 'UserLists',
                component: () => import('@/views/system/UserLists.vue'),
                meta: { title: '系统用户管理', icon: 'peoples' ,roles: ['admin']}
            }
        ]
    }


export default systemRouter