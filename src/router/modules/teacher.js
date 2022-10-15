import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const teacherRouter = 
    {
        path: '/teacher',
        name: 'Teacher',
        component: Layout,
        meta: { title: '教师主页', icon: 'el-icon-s-home', roles: ['teacher'] },
        children:[
            {
                path: 'main',
                name: 'Main',
                component: () => import('@/views/teacher'),
                meta: { title: '教师主页', icon: 'el-icon-s-home' }
            }
        ]
    }


export default teacherRouter