import Layout from '@/layout'

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