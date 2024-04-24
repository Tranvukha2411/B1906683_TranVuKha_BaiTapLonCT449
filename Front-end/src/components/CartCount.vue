<template>
    <div class="counts">
        {{ totalProductCount }}
    </div>
</template>
<script>

import bookstoreService from '../services/bookstore.service';

export default {
    props: {
        userID: { type: String, require: true },
        totalKey: {type: Number, require: true},
    },
    data() {
    return {
      totalProductCount: 0,
    };
  },
  mounted() {
    this.fetchCartData();
  },
  watch: {
    userID: 'fetchCartData',
    totalKey: 'fetchCartData',
  },
  created() {
    
  },
  methods: {
    async fetchCartData() {
      try {
        //lấy giỏ hàng dựa trên userID
        const cartData = await bookstoreService.getAllCart(this.userID);
        
        // Tính tổng số lượng sản phẩm trong giỏ hàng
        let totalCount = 0;
        for (const item of cartData) {
          totalCount += item.count;
        }
        this.totalProductCount = totalCount;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
      }
    },
  },
}
</script>