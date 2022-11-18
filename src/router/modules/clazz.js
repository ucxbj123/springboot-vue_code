import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const clazzRouter = 
    {
        path: '/clazz',
        name: 'Clazz',
        component: Layout,
        alwaysShow: true ,
        meta: { title: '班级管理', icon: '班级管理-未点击', roles: ['admin','teacher'] },
        children:[
            {
                path: 'clazzinfo',
                name: 'Clazzinfo',
                component: () => import('@/views/clazz/Clazzinfo.vue'),
                meta: { title: '班级信息', icon: '班级' ,roles: ['admin','teacher']}
            }
        ]
    }


export default clazzRouter