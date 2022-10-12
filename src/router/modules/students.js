import Layout from '@/layout'

const studentsRouter = 
    {
        path: '/student',
        component: Layout,
        meta: {
            title: '学生信息管理',
            icon: 'el-icon-s-check'
        },
        redirect: '/student/main',
        children:[
            {
                path: 'main',
                name: 'Main',
                component: () => import('@/views/student'),
                meta: { title: '学生模块', icon: 'el-icon-user-solid' }
            },
            {
                path: 'list',
                name: 'List',
                component: () => import('@/views/student/studentList'),
                meta: { title: '学生列表', icon: 'el-icon-user' }
            }
        ]
    }

export default studentsRouter