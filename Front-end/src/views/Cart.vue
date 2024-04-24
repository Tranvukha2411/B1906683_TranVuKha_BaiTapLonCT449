
<template>
    <div class="title">
        <h2>GIỎ HÀNG</h2>
        <div class="history-groups" data-bs-toggle="modal" data-bs-target="#myModalShowHistory">
            <i class="history-titles">Xem lịch sử đặt hàng</i><i class="fa-solid fa-landmark"></i>
        </div>
    </div>

    <ShowCart :products="products" v-model:activeIndex="activeIndex" @refresh-orderbill="retriveOrderBill"
        @invoice-id-selected="handleSelected" :getCheck="getCheck"></ShowCart>
    <div class="modal fade" id="myModalShowHistory">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Lịch sử thanh toán</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="product-detail-body">
                        <PaymentHistory :orderBill="getPayment"></PaymentHistory>
                    </div>
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
    </div>
    <div class="footer-button">
        <div class="deleteAll" v-if="products.length != 0">
            <button class="btn btn-danger" @click="deleteAllCarts">Xóa tất cả sản phẩm trong giỏ hàng</button>
        </div>
        <div class="buy-select">
            <button class="btn btn-primary" @click="takegetCheck">Chọn các sản phẩm để thanh toán</button>
        </div>
        <div class="buyAll" v-if="products.length != 0 && !getCheck">
            <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#buyAllBook">Mua tất cả sản phẩm</button>
        </div>
        <div class="buy-selected">
            <button v-if="getCheck" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#bySelectedBook">Thanh toán</button>
        </div>
    </div>
    <div class="modal fade" id="buyAllBook">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Chọn phương thức thanh toán</h2>
                </div>
                <div class="modal-body">
                    <div class="pay">
                        <div class="cash-pay" @click="buyAllProduct" data-bs-toggle="modal" data-bs-target="#buyAllBook">
                            <img src="../assets/images/cash-pay.png" alt="">
                            <strong>Tiền mặt</strong>
                        </div>
                        <div class="credit-pay" @click="commingSoon" data-bs-toggle="modal" data-bs-target="#buyAllBook">
                            <img src="../assets/images/credit.png" alt="">
                            <strong>Chuyển khoản</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="bySelectedBook">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Chọn phương thức thanh toán</h2>
                </div>
                <div class="modal-body">
                    <div class="pay">
                        <div class="cash-pay" @click="buySelectedCart" data-bs-toggle="modal" data-bs-target="#bySelectedBook">
                            <img src="../assets/images/cash-pay.png" alt="">
                            <strong>Tiền mặt</strong>
                        </div>
                        <div class="credit-pay" @click="commingSoon" data-bs-toggle="modal" data-bs-target="#bySelectedBook">
                            <img src="../assets/images/credit.png" alt="">
                            <strong>Chuyển khoản</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ShowCart from '../components/ShowCart.vue';
import bookstoreService from '../services/bookstore.service';
import PaymentHistory from '../components/PaymentHistory.vue';
import Swal from 'sweetalert2';


export default {
    components: {
        ShowCart,
        PaymentHistory,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            products: [],
            activeIndex: -1,
            orderBill: [],
            allProduct: [],
            bill: {
                username: '',
                userID: '',
                confirmed: false,
                ngaythem: '',
                tongtien: 0,
                items: [
                    {
                        name: '',
                        price: '',
                        count: '',
                        img: '',
                        productId: '',
                    }
                ],
            },
            selectedCart: [],
            carts: [],
            getCheck: false,
        }
    },
    computed: {
        getPayment() {
            return this.orderBill;
        }
    },
    methods: {
        async retriveCart() {
            try {
                this.products = await bookstoreService.getAllCart(this.id);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteAllCarts() {
            Swal.fire({
                title: "Bạn chắc chắn chứ?",
                text: "Bạn có chắc là muốn xóa hết sản phẩm trong giỏ hàng không?",
                icon: "question",
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(this.id);
                    bookstoreService.deleteAllCart(this.id);
                    location.reload();
                }
            });

        },
        takegetCheck() {
            if (!this.getCheck) {
                this.getCheck = true;
            } else {
                this.getCheck = false;
            }
        },
        handleSelected(selectedInvoice) {
            this.selectedCart = selectedInvoice;
        },
        commingSoon() {
            Swal.fire({
                title: "Comming soon",
                text: "Chức năng này sẽ được phát triển trong tương lai!",
                icon: "info"
            });
        },
        async buySelectedCart() {
            await this.selectedCart.forEach(async (id, index) => {
                this.carts[index] = await bookstoreService.getCart(id);
            });
            const swalResult = await Swal.fire({
                title: "Xác nhận mua hàng",
                text: "Xác nhận thanh toán các loại hàng đã chọn",
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
                const user = await bookstoreService.get(this.id);
                this.bill.ngaythem = formattedDate;
                this.bill.userID = this.id;
                this.bill.username = user.name;
                this.carts.forEach((product, index) => {
                    const newItem = {
                        name: product.name,
                        price: product.price,
                        count: product.count,
                        img: product.img,
                        productId: product.productId,
                    };
                    this.bill.items[index] = newItem;
                    this.bill.tongtien += (this.bill.items[index].price * this.bill.items[index].count);
                });
                this.carts.forEach(async (product, index) => {
                    this.carts[index].bought = true;
                    await bookstoreService.deleteCartCount(this.carts[index]._id, this.carts[index]);
                });
                await bookstoreService.createOrder(this.bill);
                this.bill = [];
            }
        },
        async retriveOrderBill() {
            this.orderBill = await bookstoreService.getPaymentHistory(this.id);
        },
        async getRemaining() {
            await this.retriveCart();
            this.allProduct = this.products.filter(product => !product.bought);
        },
        async buyAllProduct() {
            if(this.allProduct.length == 0) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Không có sản phẩm nào chưa thanh toán trong giỏ hàng",
                    icon: "error"
                });
                return;
            }
            const swalResult = await Swal.fire({
                title: "Xác nhận mua hàng",
                text: "Bạn muốn thanh toán tất cả sản phẩm trong giỏ hàng?",
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
                const user = await bookstoreService.get(this.id);
                this.bill.ngaythem = formattedDate;
                this.bill.userID = this.id;
                this.bill.username = user.name;
                this.allProduct.forEach((product, index) => {
                    const newItem = {
                        name: product.name,
                        price: product.price,
                        count: product.count,
                        img: product.img,
                        productId: product.productId,
                    };
                    this.bill.items[index] = newItem;
                    this.bill.tongtien += (this.bill.items[index].price * this.bill.items[index].count);
                })
                this.allProduct.forEach(async (product, index) => {
                    this.allProduct[index].bought = true;
                    await bookstoreService.deleteCartCount(this.allProduct[index]._id, this.allProduct[index]);
                });
                await bookstoreService.createOrder(this.bill);
                this.bill = [];
            }
        },
    },

    mounted() {
        this.retriveCart();
        this.retriveOrderBill();
        this.getRemaining();
    },
}
</script>
<style scoped>
.title {
    position: relative;
    margin-top: 5px;
    padding: 10px 0;
    border: 1px solid;
    border-radius: 50px;
}

.history-groups {
    position: relative;
    left: 80%;
    border: 1px solid;
    width: 200px;
    top: -10px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background-color: rgba(54, 55, 56, 0.144);
    }
}

.history-titles {
    margin-right: 5px;
}

.footer-button {
    display: flex;
    position: fixed;
    bottom: 5px;
}
</style>