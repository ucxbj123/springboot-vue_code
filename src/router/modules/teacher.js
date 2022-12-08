import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const teacherRouter = 
    {
        path: '/teacher',
        name: 'Teacher',
        component: Layout,
        meta: { title: '教师管理', icon: 'el-icon-s-home', roles: ['teacher'] },
        alwaysShow: true,
        children:[
            {
                path: 'Teachermain',
                name: 'TeacherMain',
                component: () => import('@/views/teacher/main'),
                meta: { title: '教师信息', icon: '人员管理' },
            },
            {
                path: 'teacherClass',
                name: 'TeacherClass',
                component: () => import('@/views/teacher/TeacherClass'),
                meta: { title: '任课班级', icon: '班级'}
            }
        ]
    }


export default teacherRouter