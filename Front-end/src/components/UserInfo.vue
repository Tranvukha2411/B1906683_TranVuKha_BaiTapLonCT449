<script>
import bookstoreService from '../services/bookstore.service';
import BoughCart from './BoughCart.vue';
export default {
    components: {
        BoughCart,
    },
    props: {
        user: { type: Object, required: true },
    },
    watch: {
        user: 'retriveCart',
    },
    data() {
        return {
            cart: [],
            temp:[],
            activeIndex: -1,
        }
    },
    methods: { 
        async retriveCart() {
            this.temp = await bookstoreService.getAllCart(this.user._id);
            this.cart = this.temp.filter(product => product.bought === true);
        }
    },
    mounted() {
        this.retriveCart();
    }
};
</script>
<template>
    <div class="user-card">
        <div class="p-1">
            <strong>Tên:</strong>
            {{ user.name }}
        </div>
        <div class="p-1">
            <strong>E-mail:</strong>
            {{ user.email }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ:</strong>
            {{ user.address }}
        </div>
        <div class="p-1">
            <strong>Điện thoại:</strong>
            {{ user.phone }}
        </div>
        <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#myModalCart">Các đơn hàng đã thanh toán</button>
    </div>
    <div class="modal fade" id="myModalCart">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                    <div class="modal-content">

                        <!-- Modal body -->
                        <div class="modal-body">
                            <BoughCart :products="cart" v-model:activeIndex="activeIndex"></BoughCart>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>
</template>

<style scoped>
</style>