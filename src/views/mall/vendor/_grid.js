export default {
  headers: [
    {
      text: this.__('id'),
      value: 'id',
    },
    {
      text: 'Name',
      value: 'name',
      sortable: true,
    },
    {
      text: 'City',
      value: 'city',
      sortable: true,
    },
    {
      text: 'Website',
      value: 'website',
      sortable: true,
    },
    {
      text: 'Task',
      value: 'tasks_count',
      sortable: false,
    },
    {
      text: 'Products',
      value: 'products_count',
      render: (item) => {
        return this.$createElement(
          'span',
          {
            class: {
              'v-chip': true,
              'v-chip--outlined': true,
            },
            props: {
              text: true,
              small: true,
            },
          },
          item
        )
      },
    },
    {
      text: 'Created',
      value: 'created_at',
      sortable: true,
    },
    {
      text: 'Action',
      value: 'action',
      sortable: false,
    },
  ],
  items: [],
  actions: [
    {
      text: 'Edit Item',
      icon: 'mdi-pencil',
      click: this.handleEditItem,
    },
    {
      text: 'Edit Link Rule',
      icon: 'mdi-hammer',
      click: this.handleEditLink,
    },
    {
      text: 'Edit Item Rule',
      icon: 'mdi-hammer',
      click: this.handleEditItemMap,
    },
    {
      text: 'Delete Item',
      icon: 'mdi-close',
      click: this.handleDeleteItem,
    },
  ],
}
