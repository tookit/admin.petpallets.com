import { AuthLayout, DefaultLayout, RouterWrapper } from '@/components/layouts'
export const publicRoute = [
  {
    path: '*',
    component: () => import('@/views/error/NotFound.vue'),
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: {
      title: 'Login',
    },
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',

        meta: {
          title: 'Login',
        },
        component: () => import('@/views/auth/Login.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    meta: {
      title: 'Not Found',
    },
    component: () => import('@/views/error/NotFound.vue'),
  },

  {
    path: '/500',
    name: '500',
    meta: {
      title: 'Server Error',
    },
    component: () => import('@/views/error/Error.vue'),
  },
]

export const protectedRoute = [
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      title: 'Home',
      group: 'apps',
      icon: '',
      hiddenInMenu: true,
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          hiddenInMenu: false,
          icon: 'mdi-monitor-dashboard',
        },
      },
      //mall
      {
        path: '/mall',
        name: 'mall.index',
        meta: {
          group: 'mall',
          title: 'Mall',
          hiddenInMenu: false,
          icon: 'mdi-store',
        },
        component: RouterWrapper,
        redirect: {
          path: '/mall/item',
        },
        children: [
          // product
          {
            path: '/mall/item',
            name: 'mall.item',
            meta: {
              title: 'Product',
              hiddenInMenu: false,
              icon: 'mdi-basket',
            },
            component: RouterWrapper,
            redirect: {
              path: '/mall/item/list',
            },
            children: [
              {
                path: '/mall/item/list',
                name: 'mall.item.list',
                component: () => import('@/views/mall/item/ItemList.vue'),
                meta: {
                  title: 'Product List',
                  hiddenInMenu: false,
                  icon: 'mdi-basket',
                },
              },
              {
                path: '/mall/item/:id',
                name: 'mall.item.view',
                props: true,
                component: () => import('@/views/mall/item/ItemView.vue'),
                meta: {
                  title: 'Product item',
                  hiddenInMenu: false,
                  icon: 'mdi-basket',
                },
              },
            ],
          },
          {
            path: '/mall/quote/list',
            name: 'mall.quote.list',
            component: () => import('@/views/mall/quote/QuoteList.vue'),
            meta: {
              title: 'Quote',
              hiddenInMenu: false,
              icon: 'mdi-quora',
            },
          },
          {
            path: '/mall/vendor/list',
            name: 'mall.vendor.list',
            component: () => import('@/views/mall/vendor/VendorList.vue'),
            meta: {
              title: 'Vendor',
              hiddenInMenu: false,
              icon: 'mdi-basket',
            },
          },
          {
            path: '/mall/category',
            name: 'mall.category',
            meta: {
              title: 'Category',
              hiddenInMenu: false,
              icon: 'mdi-buffer',
            },
            component: RouterWrapper,
            redirect: {
              path: '/mall/category/list',
            },
            children: [
              {
                path: '/mall/category/list',
                name: 'mall.category.list',
                component: () =>
                  import('@/views/mall/category/CategoryList.vue'),
                meta: {
                  title: 'Category List',
                  hiddenInMenu: false,
                  icon: 'mdi-buffer',
                },
              },
              {
                path: '/mall/category/create',
                name: 'mall.category.create',
                props: true,
                component: () =>
                  import('@/views/mall/category/CategoryItem.vue'),
                meta: {
                  title: 'Create  Category',
                  hiddenInMenu: true,
                  icon: 'mdi-view',
                },
              },
              {
                path: '/mall/category/item/:id',
                name: 'mall.category.item',
                props: true,
                component: () =>
                  import('@/views/mall/category/CategoryItem.vue'),
                meta: {
                  title: 'Edit  Category',
                  hiddenInMenu: true,
                  icon: 'mdi-view',
                },
              },
            ],
          },
          // property
          {
            path: '/mall/property/list',
            name: 'mall.property.list',
            component: () => import('@/views/mall/property/PropertyList.vue'),
            meta: {
              title: 'Property',
              icon: 'mdi-filter-variant',
            },
          },
        ],
      },
      //cms
      {
        path: '/cms',
        name: 'cms.index',
        meta: {
          group: 'cms',
          title: 'CMS',
          hiddenInMenu: false,
          icon: 'mdi-newspaper',
        },
        component: RouterWrapper,
        redirect: {
          path: '/cms/news/list',
        },
        children: [
          {
            path: '/cms/news/list',
            name: 'cms.news.list',
            component: () => import('@/views/cms/news/NewsList.vue'),
            meta: {
              title: 'News',
              hiddenInMenu: false,
              icon: 'mdi-post',
            },
          },
          {
            path: '/cms/abbrs/list',
            name: 'cms.abbrs.list',
            component: () => import('@/views/cms/abbr/AbbrList.vue'),
            meta: {
              title: 'Abbr',
              hiddenInMenu: false,
              icon: 'mdi-tag',
            },
          },
          {
            path: '/cms/tags/list',
            name: 'cms.tags.list',
            component: () => import('@/views/cms/tag/TagList.vue'),
            meta: {
              title: 'Tag',
              hiddenInMenu: false,
              icon: 'mdi-tag',
            },
          },
          {
            path: '/cms/categories/list',
            name: 'cms.categories.list',
            component: () => import('@/views/cms/category/CategoryList.vue'),
            meta: {
              title: 'Category',
              hiddenInMenu: false,
              icon: 'mdi-tag',
            },
          },

          //slider
          {
            path: '/cms/slider/list',
            name: 'cms.slider.list',
            component: () => import('@/views/cms/slider/SliderList.vue'),
            meta: {
              title: 'Slider List',
              hiddenInMenu: false,
              icon: 'mdi-image-multiple',
            },
          },
        ],
      },
      //crawler
      {
        path: '/crawler',
        name: 'crawler.index',
        meta: {
          group: 'crawler',
          title: 'Crawler',
          hiddenInMenu: false,
          icon: 'mdi-robot-outline',
        },
        component: RouterWrapper,
        redirect: {
          path: '/crawler/task/list',
        },
        children: [
          {
            path: '/crawler/task',
            name: 'crawler.task',
            component: () => import('@/views/crawler/TaskList.vue'),
            meta: {
              title: 'Tasks',
              hiddenInMenu: false,
              icon: 'mdi-playlist-check',
            },
          },
        ],
      },
      {
        path: '/media',
        name: 'media.index',
        meta: {
          group: 'media',
          title: 'Media',
          hiddenInMenu: false,
          icon: 'mdi-image',
        },
        component: () => import('@/views/media/MediaList.vue'),
      },
      //setting
      {
        path: '/setting',
        name: 'setting.index',
        meta: {
          group: 'setting',
          title: 'Setting',
          hiddenInMenu: false,
          icon: 'mdi-cogs',
        },
        component: () => import('@/views/Setting.vue'),
      },
      //acl
      {
        path: '/acl',
        name: 'acl.index',
        meta: {
          group: 'acl',
          title: 'ACL',
          hiddenInMenu: false,
          icon: 'mdi-shield-account',
        },
        component: RouterWrapper,
        redirect: {
          path: '/acl/user',
        },
        children: [
          {
            path: '/acl/user',
            name: 'acl.user',
            component: () => import('@/views/acl/user/UserList.vue'),
            meta: {
              title: 'Users',
              hiddenInMenu: false,
              icon: 'mdi-account',
            },
          },
        ],
      },
      {
        path: '/403',
        name: 'Forbidden',
        meta: {
          title: 'Access Denied',
          hidden: true,
        },
        component: () => import('@/views/error/Deny.vue'),
      },
    ],
  },
]
