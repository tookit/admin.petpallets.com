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
import i18n from '../plugins/i18n'
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
          title: i18n.t('dashboard'),
          hiddenInMenu: false,
          icon: 'mdi-monitor-dashboard',
        },
      },
      //mall
      {
        path: '/mall',
        name: 'mall.index',
        meta: {
          title: i18n.t('mall'),
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
              title: i18n.t('product'),
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
                  title: i18n.t('list'),
                  icon: 'mdi-basket',
                },
              },
              {
                path: '/mall/item/:id',
                name: 'mall.item.view',
                props: true,
                component: () => import('@/views/mall/item/ItemView.vue'),
                meta: {
                  title: i18n.t('view product'),
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
              title: i18n.t('vendor'),
              icon: 'mdi-basket',
            },
          },
          {
            path: '/mall/category',
            name: 'mall.category',
            meta: {
              title: i18n.t('category'),
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
                  title: i18n.t('list'),
                  icon: 'mdi-buffer',
                },
              },
              {
                path: '/mall/category/item/:id',
                name: 'mall.category.item',
                props: true,
                component: () =>
                  import('@/views/mall/category/CategoryItem.vue'),
                meta: {
                  title: i18n.t('view'),
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
              title: i18n.t('property'),
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
              title: i18n.t('post'),
              icon: 'mdi-post',
            },
          },
          {
            path: '/cms/tags/list',
            name: 'cms.tags.list',
            component: () => import('@/views/cms/tag/TagList.vue'),
            meta: {
              title: i18n.t('tag'),
              icon: 'mdi-alpha-t',
            },
          },
          {
            path: '/cms/categories/list',
            name: 'cms.categories.list',
            component: () => import('@/views/cms/category/CategoryList.vue'),
            meta: {
              title: i18n.t('category'),
              icon: 'mdi-alpha-c',
            },
          },

          //slider
          {
            path: '/cms/slider/list',
            name: 'cms.slider.list',
            component: () => import('@/views/cms/slider/SliderList.vue'),
            meta: {
              title: i18n.t('slider'),
              icon: 'mdi-image-multiple',
            },
          },
        ],
      },
      //supplier
      {
        path: '/supplier',
        name: 'supplier.supplier',
        meta: {
          group: 'supplier',
          title: 'supplier',
          icon: 'mdi-view-list',
        },
        component: RouterWrapper,
        redirect: {
          path: '/supplier/item/list',
        },
        children: [
          {
            path: '/supplier/item/list',
            name: 'supplier.item.list',
            component: () => import('@/views/supplier/item/ItemList.vue'),
            meta: {
              title: i18n.t('supplier'),
              icon: 'mdi-post',
            },
          },
        ],
      },

      {
        path: '/media',
        name: 'media.index',
        meta: {
          title: i18n.t('media'),
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
          title: i18n.t('acl'),
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
              title: i18n.t('user'),
              icon: 'mdi-account',
            },
          },
        ],
      },
      {
        path: '/403',
        name: 'Forbidden',
        meta: {
          title: i18n.t('access denied'),
          hidden: true,
        },
        component: () => import('@/views/error/Deny.vue'),
      },
    ],
  },
]
