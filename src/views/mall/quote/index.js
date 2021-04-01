export default {
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Username',
          value: 'username',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Phone',
          value: 'mobile',
        },
        {
          text: 'Product',
          value: 'product',
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: {
                  href: item.product.href,
                  target: '_blank',
                },
              },
              item.product.id
            )
          },
        },
        {
          text: 'Remark',
          value: 'remark',
        },
        {
          text: 'Ip',
          value: 'ip',
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
      items: [],
      actions: [
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    filterItems() {
      return []
    },
  },
  watch: {},
  methods: {
    //action
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteQuote', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
