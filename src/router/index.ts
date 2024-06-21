import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

Vue.use(VueRouter)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['developer-admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/

export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue'),
  //       name: 'Guide',
  //       meta: {
  //         title: 'guide',
  //         icon: 'guide',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/directive',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['developer-admin', 'peopling-admin'] // you can set roles in root nav
      // ,alwaysShow: true // will always show the root menu
    },
    children: [
      {
        path: 'page',
        component: () => import(/* webpackChunkName: "permission-page" */ '@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['developer-admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission',
          roles: ['developer-admin'] // or you can only set roles in sub nav
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import(/* webpackChunkName: "permission-role" */ '@/views/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          icon: 'lock',
          title: 'rolePermission',
          roles: ['developer-admin', 'peopling-admin']
        }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "icons" */ '@/views/icons/index.vue'),
        name: 'Icons',
        meta: {
          title: 'icons',
          icon: 'icon',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    meta: {
      title: 'example',
      icon: 'example',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'create',
        component: () => import(/* webpackChunkName: "example-create" */ '@/views/example/create.vue'),
        name: 'CreateArticle',
        meta: {
          title: 'createArticle',
          icon: 'edit'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import(/* webpackChunkName: "example-edit" */ '@/views/example/edit.vue'),
        name: 'EditArticle',
        meta: {
          title: 'editArticle',
          noCache: true,
          activeMenu: '/example/list',
          hidden: true
        }
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "example-list" */ '@/views/example/list.vue'),
        name: 'ArticleList',
        meta: {
          title: 'articleList',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/tab',
    component: Layout,
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "tab" */ '@/views/tab/index.vue'),
        name: 'Tab',
        meta: {
          title: 'tab',
          icon: 'tab'
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'errorPages',
      icon: '404',
      roles: ['developer-admin']
    },
    children: [
      {
        path: '401',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
        name: 'Page401',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: 'Page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'log',
        component: () => import(/* webpackChunkName: "error-log" */ '@/views/error-log/index.vue'),
        name: 'ErrorLog',
        meta: {
          title: 'errorLog',
          icon: 'bug'
        }
      }
    ]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    meta: {
      title: 'excel',
      icon: 'excel',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'export-excel',
        component: () => import(/* webpackChunkName: "export-excel" */ '@/views/excel/export-excel.vue'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import(/* webpackChunkName: "select-excel" */ '@/views/excel/select-excel.vue'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'export-merge-header',
        component: () => import(/* webpackChunkName: "merge-header" */ '@/views/excel/merge-header.vue'),
        name: 'MergeHeader',
        meta: { title: 'mergeHeader' }
      },
      {
        path: 'upload-excel',
        component: () => import(/* webpackChunkName: "upload-excel" */ '@/views/excel/upload-excel.vue'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },
  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    meta: {
      title: 'zip',
      icon: 'zip',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'download',
        component: () => import(/* webpackChunkName: "zip" */ '@/views/zip/index.vue'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },
  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "pdf" */ '@/views/pdf/index.vue'),
        name: 'PDF',
        meta: {
          title: 'pdf',
          icon: 'pdf'
        }
      }
    ]
  },
  {
    path: '/pdf-download-example',
    component: () => import(/* webpackChunkName: "pdf-download-example" */ '@/views/pdf/download.vue'),
    meta: { hidden: true }
  },
  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "theme" */ '@/views/theme/index.vue'),
        name: 'Theme',
        meta: {
          title: 'theme',
          icon: 'theme'
        }
      }
    ]
  },
  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/clipboard/index.vue'),
        name: 'Clipboard',
        meta: {
          title: 'clipboard',
          icon: 'clipboard'
        }
      }
    ]
  },
  {
    path: '/i18n',
    component: Layout,
    meta: {
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "i18n-demo" */ '@/views/i18n-demo/index.vue'),
        name: 'I18n',
        meta: {
          title: 'i18n',
          icon: 'international'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const asyncModulesRoutes: RouteConfig[] = [
  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'ComponentDemo',
    meta: {
      title: 'components',
      icon: 'component',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'tinymce',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/tinymce.vue'),
        name: 'TinymceDemo',
        meta: { title: 'tinymce' }
      },
      {
        path: 'markdown',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/markdown.vue'),
        name: 'MarkdownDemo',
        meta: { title: 'markdown' }
      },
      {
        path: 'json-editor',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/json-editor.vue'),
        name: 'JsonEditorDemo',
        meta: { title: 'jsonEditor' }
      },
      {
        path: 'split-pane',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/split-pane.vue'),
        name: 'SplitPaneDemo',
        meta: { title: 'splitPane' }
      },
      {
        path: 'avatar-upload',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/avatar-upload.vue'),
        name: 'AvatarUploadDemo',
        meta: { title: 'avatarUpload' }
      },
      {
        path: 'dropzone',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/dropzone.vue'),
        name: 'DropzoneDemo',
        meta: { title: 'dropzone' }
      },
      {
        path: 'sticky',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/sticky.vue'),
        name: 'StickyDemo',
        meta: { title: 'sticky' }
      },
      {
        path: 'count-to',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/count-to.vue'),
        name: 'CountToDemo',
        meta: { title: 'countTo' }
      },
      {
        path: 'mixin',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/mixin.vue'),
        name: 'ComponentMixinDemo',
        meta: { title: 'componentMixin' }
      },
      {
        path: 'back-to-top',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/back-to-top.vue'),
        name: 'BackToTopDemo',
        meta: { title: 'backToTop' }
      },
      {
        path: 'draggable-dialog',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/draggable-dialog.vue'),
        name: 'DraggableDialogDemo',
        meta: { title: 'draggableDialog' }
      },
      {
        path: 'draggable-select',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/draggable-select.vue'),
        name: 'DraggableSelectDemo',
        meta: { title: 'draggableSelect' }
      },
      {
        path: 'draggable-list',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/draggable-list.vue'),
        name: 'DraggableListDemo',
        meta: { title: 'draggableList' }
      },
      {
        path: 'draggable-kanban',
        component: () => import(/* webpackChunkName: "components-demo" */ '@/views/components-demo/draggable-kanban.vue'),
        name: 'DraggableKanbanDemo',
        meta: { title: 'draggableKanban' }
      }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'Charts',
    meta: {
      title: 'charts',
      icon: 'chart',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'bar-chart',
        component: () => import(/* webpackChunkName: "charts-demo" */ '@/views/charts/bar-chart.vue'),
        name: 'BarChartDemo',
        meta: {
          title: 'barChart',
          noCache: true
        }
      },
      {
        path: 'line-chart',
        component: () => import(/* webpackChunkName: "charts-demo" */ '@/views/charts/line-chart.vue'),
        name: 'LineChartDemo',
        meta: {
          title: 'lineChart',
          noCache: true
        }
      },
      {
        path: 'mixedchart',
        component: () => import(/* webpackChunkName: "charts-demo" */ '@/views/charts/mixed-chart.vue'),
        name: 'MixedChartDemo',
        meta: {
          title: 'mixedChart',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1/menu1-1',
    name: 'Nested',
    meta: {
      title: 'nested',
      icon: 'nested',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'menu1',
        component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu1/index.vue'),
        redirect: '/nested/menu1/menu1-1',
        name: 'Menu1',
        meta: { title: 'menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu1/menu1-1/index.vue'),
            name: 'Menu1-1',
            meta: { title: 'menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu1/menu1-2/index.vue'),
            name: 'Menu1-2',
            redirect: '/nested/menu1/menu1-2/menu1-2-1',
            meta: { title: 'menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                name: 'Menu1-2-1',
                meta: { title: 'menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                name: 'Menu1-2-2',
                meta: { title: 'menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu1/menu1-3/index.vue'),
            name: 'Menu1-3',
            meta: { title: 'menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: () => import(/* webpackChunkName: "nested-demo" */ '@/views/nested/menu2/index.vue'),
        meta: { title: 'menu2' }
      }
    ]
  },
  {
    path: '/table',
    component: Layout,
    redirect: '/table/complex-table',
    name: 'Table',
    meta: {
      title: 'table',
      icon: 'table',
      roles: ['developer-admin']
    },
    children: [
      {
        path: 'dynamic-table',
        component: () => import(/* webpackChunkName: "table-demo" */ '@/views/table/dynamic-table/index.vue'),
        name: 'DynamicTable',
        meta: { title: 'dynamicTable' }
      },
      {
        path: 'draggable-table',
        component: () => import(/* webpackChunkName: "table-demo" */ '@/views/table/draggable-table.vue'),
        name: 'DraggableTable',
        meta: { title: 'draggableTable' }
      },
      {
        path: 'inline-edit-table',
        component: () => import(/* webpackChunkName: "table-demo" */ '@/views/table/inline-edit-table.vue'),
        name: 'InlineEditTable',
        meta: { title: 'inlineEditTable' }
      },
      {
        path: 'complex-table',
        component: () => import(/* webpackChunkName: "table-demo" */ '@/views/table/complex-table.vue'),
        name: 'ComplexTable',
        meta: { title: 'complexTable' }
      }
    ]
  }
]

const asyncPeoplingRoutes: RouteConfig[] = [
  {
    path: '/employee-management',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "user-management" */ '@/views/employee-management/index.vue'),
        name: 'Employee-Management',
        meta: {
          title: 'employeeManagement',
          icon: 'peoples'
        }
      }
    ]
  },
  {
    path: '/user-management',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "user-management" */ '@/views/user-management/index.vue'),
        name: 'user-Management',
        meta: {
          title: 'userManagement',
          icon: 'user'
        }
      }
    ]
  },
  {
    path: '/company-management',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "company-management" */ '@/views/company-management/index.vue'),
        name: 'company-management',
        meta: {
          title: 'companyManagement',
          icon: 'international'
        }
      }
    ]
  },
  {
    path: '/parameters',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/parameters/index.vue'),
        name: 'parameters',
        meta: {
          title: 'parameters',
          icon: 'nested'
        }
      }
    ]
  },
  {
    path: '/variables',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/variables/index.vue'),
        name: 'variables',
        meta: {
          title: 'variables',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/budget-managment',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/budget-managment/index.vue'),
        name: 'budget-managment',
        meta: {
          title: 'budgetManagement',
          icon: 'money'
        }
      }
    ]
  }, {
    path: '/reports',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      roles: ['peopling-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "clipboard" */ '@/views/reports/index.vue'),
        name: 'reports',
        meta: {
          title: 'reports',
          icon: 'skill'
        }
      }
    ]
  }
]

// add other modules
asyncRoutes.push(...asyncModulesRoutes)
asyncRoutes.push(...asyncPeoplingRoutes)

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
