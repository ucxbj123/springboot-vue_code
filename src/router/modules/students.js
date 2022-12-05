import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const studentsRouter = 
    {
        path: '/student',
        component: Layout,
        name:'Student',
        meta: {
            title: '学生管理',
            icon: 'el-icon-s-check',
            roles: ['student']
        },
        redirect: '/student/main',
        children:[
            {
                path: 'main',
                name: 'studentmain',
                component: () => import('@/views/student/main'),
                meta: { title: '学生信息', icon: 'el-icon-user-solid',roles: ['student'] }
            },
            {
                path: 'list',
                name: 'studentlist',
                component: () => import('@/views/student/studentList'),
                meta: { title: '学生班级', icon: 'el-icon-user',roles: ['student']  }
            }
        ]
    }

export default studentsRouter