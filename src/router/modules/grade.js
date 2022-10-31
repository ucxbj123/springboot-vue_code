import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const gradeRouter = 
    {
        path: '/grade',
        name: 'Grade',
        component: Layout,
        alwaysShow: true ,
        meta: { title: '年级管理', icon: '年级管理', roles: ['admin','Grade'] },
        children:[
            {
                path: 'gradeinfo',
                name: 'Gradeinfo',
                component: () => import('@/views/grade/Gradeinfo.vue'),
                meta: { title: '年级信息', icon: '年级' ,roles: ['admin']}
            }
        ]
    }


export default gradeRouter