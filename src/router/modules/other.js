import Layout from '@/layout'

//注意事项：因为应用了缓存组件keep-alive，需要路由的name属性和组件的name一致，否则会有内存溢出风险
const otherRouter = 
    {
        path: '/other',
        name: 'Other',
        component: Layout,
        alwaysShow: true ,
        meta: { title: '其他', icon: '其他', roles: ['admin'] },
        children:[
            {
                path: 'check',
                name: 'Check',
                component: () => import('@/views/other/check'),
                meta: { title: '检验标准', icon: '检验管理' ,roles: ['admin']},
                children:[
                    {
                        path: 'checkinfo',
                        name: 'checkinfo',
                        component: () => import('@/views/other/check/checkinfo'),
                        meta: { title: '检验标准', icon: '检验管理' ,roles: ['admin']},  
                    },
                    {
                        path: 'checkDetailed',
                        name: 'checkDetailed',
                        hidden: true,
                        component: () => import('@/views/other/check/checkDetailed'),
                        meta: { title: '检验标准明细', icon: '校验新增' ,roles: ['admin']},  
                    }
                ]
            }
        ]
    }


export default otherRouter