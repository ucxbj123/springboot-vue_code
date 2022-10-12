import Layout from '@/layout'

const teacherRouter = [
    {
        path: '/teacher',
        component: Layout,
        children:[
            {
                path: 'main',
                name: 'Main',
                component: () => import('@/views/teacher'),
                meta: { title: '教师主页', icon: 'el-icon-s-home' }
            }
        ]
    }
]

export default teacherRouter