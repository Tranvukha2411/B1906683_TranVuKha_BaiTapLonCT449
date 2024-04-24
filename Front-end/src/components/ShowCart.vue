<template>
    <ul class="cart-list">
       
        <li class="cart-list-item" v-for="(product, index) in sortedCarts" :key="product._id"
            :class="{ active: index === activeIndex }">
            <div class="items">
                <div class="img-item">
                    <img :src="product.img" alt="">
                </div>
                <div class="detail">
                    <div class="item-detail">
                        <strong>Tên:</strong> {{ product.name }}
                    </div>
                    <div class="item-detail">
                        {{ product.type }}
                    </div>
                    <div class="item-detail">
                        <strong>Tác giả:</strong> {{ product.author }}
                    </div>
                    <div class="item-detail">
                        <strong>Giá:</strong> {{ formatNumber(product.price) }} VNĐ
                    </div>
                    <div class="item-detail">
                        <strong>Số lượng:</strong> {{ product.count }}
                    </div>
                    <div class="item-detail">
                        <strong>Tổng:</strong> {{ formatNumber(product.price * product.count) }} VNĐ
                    </div>
                    <i class="fa-solid fa-trash trash-icon" @click="getDeleted(product._id)" data-bs-toggle="modal"
                        data-bs-target="#myModal"></i>
                </div>
                <div class="describe-item">
                    <strong>Mô tả:</strong> {{ product.describe }}
                </div>
                <div :class="{ 'buy': !checkProductCount(product), 'bough': checkProductCount(product) }" v-if="!product.vanchuyen">
                    <button data-bs-toggle="modal" data-bs-target="#myModalPay" @click="getTempIndex(index)">Thanh
                        toán</button>
                    <p style="font-weight: bold;">Chờ chốt đơn...</p>
                </div>
                <div class="accepted" v-if="product.vanchuyen">
                    <p style="font-weight: bold;">Đang vận chuyển...</p>
                </div>
                <div class="form-check2" v-if="getCheck && !product.bought">
                    <input name="deleteInvoice" type="checkbox" class="form-check-input2" :value="product._id"
                        v-model="selectedCart">
                </div>
            </div>

        </li>
    </ul>
    <div class="modal fade" id="myModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Xóa sản phẩm</h2>
                </div>
                <div class="modal-body">
                    Bạn muốn xóa bao nhiêu sản phẩm? <DeleteCart :productID="productid"></DeleteCart>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="myModalPay">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Chọn phương thức thanh toán</h2>
                </div>
                <div class="modal-body">
                    <div class="pay">
                        <div class="cash-pay" @click="cashPayAlert" data-bs-toggle="modal" data-bs-target="#myModalPay">
                            <img src="../assets/images/cash-pay.png" alt="">
                            <strong>Tiền mặt</strong>
                        </div>
                        <div class="credit-pay" @click="commingSoon" data-bs-toggle="modal" data-bs-target="#myModalPay">
                            <img src="../assets/images/credit.png" alt="">
                            <strong>Chuyển khoản</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="empty" v-if="products.length == 0">
        <strong>Trống</strong>
    </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.min.css";
import DeleteCart from "./DeleteCart.vue";
import Swal from "sweetalert2";
import bookstoreService from "../services/bookstore.service";

export default {
    components: {
        DeleteCart,

    },
    props: {
        products: { type: Object, default: [] },
        activeIndex: { type: Number, default: -1 },
        getCheck: {type: Boolean, default: false},
    },
    data() {
        return {
            deleted: false,
            productid: '',
            tempIndex: null,
            cost:'',
            order: {
                username: '',
                userID: '',
                confirmed: false,
                ngaythem: '',
                tongtien: 0,
                items: [],
            },
            selectedCart:[],
        }
    },
    computed: {
        sortedCarts() {
            return this.products.slice().reverse();
        }
    },
    watch: {
        selectedCart(newValue) {
            this.$emit('invoice-id-selected', newValue);
        },
    },
    methods: {
        getDeleted(id) {
            if (!this.deleted) {
                this.deleted = true;
                this.productid = id;
            } else {
                this.deleted = false;
            }
        },
        alert() {
            Swal.fire({
                title: "Comming soon",
                text: "Chức năng này sẽ được phát triển trong tương lai!",
                icon: "info"
            });
        },
        deleteSelectedProducts() {
            // Gửi danh sách selectedProducts về ParentComponent
            this.$emit('delete-selected-products', this.selectedCart);
            // Đặt lại danh sách selectedProducts
            this.selectedCart = [];
        },
        getTempIndex(index) {
            const productIdInTopProducts = this.sortedCarts[index]._id;
                this.tempIndex = this.products.findIndex((product) => product._id === productIdInTopProducts);
        },
        async cashPayAlert() {
            let localProduct = this.products[this.tempIndex];
            try {
                const swalResult = await Swal.fire({
                    title: "Xác nhận mua hàng",
                    text: "Xác nhận thanh toán với giá " + localProduct.count * localProduct.price,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Hủy",
                });

                if (swalResult.isConfirmed) {
                    const currentDate = new Date();
                    const day = currentDate.getDate();
                    const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
                    const year = currentDate.getFullYear();
                    const formattedDate = `${day}/${month}/${year}`;
                    localProduct.bought = true;
                    localProduct.ngaythem = formattedDate;
                    await bookstoreService.deleteCartCount(localProduct._id, localProduct);
                    const user = await bookstoreService.get(localProduct.userID);
                    const item = {
                        name:localProduct.name,
                        price:localProduct.price,
                        count:localProduct.count,
                        img:localProduct.img,
                        productId:localProduct.productId,
                    }
                    this.order.items.push(item);
                    this.order.tongtien = localProduct.price * localProduct.count;
                    this.order.userID = localProduct.userID;
                    this.order.username = user.name;
                    this.order.ngaythem = formattedDate;
                    await bookstoreService.createOrder(this.order);
                    this.$emit('refresh-orderbill');
                }
            } catch (error) {
                console.log(error);
            }
        },
        checkProductCount(product) {
            return product.bought;
        },

        commingSoon() {
            Swal.fire({
                title: "Comming soon",
                text: "Chức năng này sẽ được phát triển trong tương lai!",
                icon: "info"
            });
        },

        formatNumber(number) {
            return number.toLocaleString();
        },
    },
    mounted() {
        
    }
}
</script>

<style>
.items {
    margin: 20px;
    display: flex;
    flex-direction: row;
}

.cart-list {
    position: relative;
}

.cart-list-item img {
    width: 120px;
    height: 150px;
}

.cart-list-item {
    margin-top: 15px;
    position: relative;
    list-style: none;
    border: 2px solid rgb(142, 142, 249);
    border-radius: 5px;
}

.detail {
    margin-left: 20px;
    max-width: 400px;
    width: 250px;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgb(181, 178, 178);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    max-height: 500px;
    height: 500px;
    font-size: 100px;
    opacity: 0.3;
    position: relative;
}

.modal-header {
    text-align: center;
    align-items: center;
    justify-content: center;
    color: rgb(56, 75, 220);
}



.trash-icon {
    cursor: pointer;
}
.describe-item{
    width: 350px;
    text-align: justify;
    max-height: 200px;
    overflow: auto;
}
.form-check2{
    position: absolute;
    right: 3%;
    bottom: 5%;
    width: 30px;
    height: 30px;
    & input{
        width: 25px;
        height: 25px;
    }
}


</style>