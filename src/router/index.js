import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '../views/Layout/Layout'

export const constantRouterMap = [{
    path: '/404',
    component: () =>
        import ('@/views/404'),
    hidden: true
}, ]

export default new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = [{
        path: '',
        redirect: '/project',
        hidden: true
    },
    {
        path: '',
        component: Layout,
        children: [{
            path: 'project',
            name: 'project',
            component: () =>
                import ('@/views/Project/Project.vue'),
            meta: { title: '项目管理', icon: 'list', roles: ['leader'] },
        }]
    },
    {
        path: '/project',
        component: Layout,
        hidden: true,
        children: [{
            path: ':project_name',
            name: 'info',
            component: () =>
                import ('@/views/ProjectInfo/ProjectInfo.vue'),
            meta: { title: '项目详情', icon: 'ip', roles: ['leader'] },

        }]
    },
    {
        path: '',
        component: Layout,
        children: [{
            path: 'createProject',
            name: 'createProject',
            component: () =>
                import ('@/views/CreateProject/CreateProject'),
            meta: { title: '创建工程', icon: 'add_project', roles: ['leader'] }
        }]
    },
    {
        path: '',
        component: Layout,
        children: [{
            path: 'machine',
            name: 'machine',
            component: () =>
                import ('@/views/Machine/Machine'),
            meta: { title: '节点', icon: 'tree', roles: ['leader'] }
        }]
    },
    {
        path: '',
        component: Layout,
        children: [{
            path: 'data',
            name: 'data',
            component: () =>
                import ('@/views/DataCenter/DataCenter'),
            meta: { title: '数据中心', icon: 'server', roles: ['leader'] }
        }]
    },
    {
        path: '',
        component: Layout,
        children: [{
            path: 'templates',
            name: 'templates',
            component: () =>
                import ('@/views/Templates/Templates'),
            meta: { title: '模板管理', icon: 'visual', roles: ['leader'] }
        }]
    },
    {
        path: '',
        component: Layout,
        children: [{
            path: 'proxyIp',
            name: 'proxyIp',
            component: () =>
                import ('@/views/ProxyIp/ProxyIp'),
            meta: { title: 'IP代理', icon: 'ip', roles: ['leader'] }
        }]
    },
    {
        path: '*',
        component: () =>
            import ('@/views/404'),

        // children: [{
        //     path: '404',
        //     name: '404',
        //     component: () =>
        //         import ('@/views/404'),
        //     meta: { title: 'IP代理', icon: 'ip', roles: ['leader'] }
        // }]
    }
]