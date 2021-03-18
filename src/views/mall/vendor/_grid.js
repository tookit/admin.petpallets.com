export default {
  headers: [
    {
      text: this.__('id'),
      value: 'id',
    },
    {
      text: 'Name',
      value: 'name',
      searchable: true,
    },
    {
      text: 'City',
      value: 'city',
    },
    {
      text: 'Website',
      value: 'website',
    },
    {
      text: 'Task',
      value: 'tasks_count',
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
    },
    {
      text: 'Action',
      value: 'action',
    },
  ],
}
