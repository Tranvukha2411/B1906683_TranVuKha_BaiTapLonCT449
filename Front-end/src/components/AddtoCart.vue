<template>
    <button class="btn btn-primary add-to-card" @click="addCart" data-bs-toggle="modal">Thêm</button>
</template>
<script>
import bookstoreService from '../services/bookstore.service';
import Swal from 'sweetalert2';

export default {
    props: {
        userId: { type: String, require: true },
        productId: { type: String, require: true },
        // cartId: {type: String, default: null},
        cartCount: { type: Number, default: 0 },
    },
    emits: ["submit", "update:modelValue"],
    data() {
        return {
            product: [],
            localCart: {
                userID: null,
                productId: this.productId,
                name: '',
                type: '',
                img: null,
                price: null,
                describe: '',
                author: '',
                count: 0,
                cost: 0,
            },
            getCart: [],
        }
    },
    methods: {
        async retriveProductId() {
            this.product = await bookstoreService.getProduct(this.productId);
            this.localCart.name = this.product.name;
            this.localCart.type = this.product.type;
            this.localCart.img = this.product.img;
            this.localCart.price = this.product.price;
            this.localCart.describe = this.product.describe;
            this.localCart.author = this.product.author;
        },

        async addCart() {
            if (this.userId == null) {
                setTimeout(() => {
                    this.localCart.userID = this.userId;
                    bookstoreService.addCart(this.localCart, this.userId);

                }, 1000);
            } else {
                try {
                    const swalResult = await Swal.fire({
                        title: "Thêm sản phẩm",
                        text: "Bạn có muốn thêm sản phẩm vào giỏ hàng?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Thêm vào giỏ hàng",
                        cancelButtonText: "Hủy",
                    });

                    // Kiểm tra xem người dùng đã xác nhận hay không
                    if (swalResult.isConfirmed) {
                        // Thực hiện các đoạn mã sau khi xác nhận
                        this.product.revenue++;
                        bookstoreService.update(this.productId, this.product);
                        this.localCart.userID = this.userId;
                        const getCart = await bookstoreService.getOneCart(this.userId, this.productId);
                        if (getCart.bought == true) {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Đang chờ xử lý sản phầm này, không thể thêm!",
                                });
                            return;
                        }
                        this.localCart.count = getCart.count + 1;
                        this.localCart.cost = this.localCart.count * this.localCart.price;
                        await bookstoreService.updateCart(this.userId, this.productId, this.localCart);

                        // Thực hiện sự kiện emit sau khi thêm vào giỏ hàng
                        let c = Math.random() * 10000;
                        this.$emit("update:modelValue", c);
                        this.$emit("submit");
                    }
                    //lấy theo tên nên có thể trùng
                } catch (error) {
                    this.localCart.count++;
                    this.localCart.cost = this.localCart.count * this.localCart.price;
                    await bookstoreService.addCart(this.localCart, this.userId, this.productId);

                    let c = Math.random() * 10000;
                    this.$emit("update:modelValue", c);
                    this.$emit("submit");
                }
            }
        },
        async addNewCart() {
            this.localCart.count++;
            this.localCart.cost = this.localCart.count * this.localCart.price;
            await bookstoreService.addCart(this.localCart, this.userId, this.productId);

            let c = Math.random() * 10000;
            this.$emit("update:modelValue", c);
            this.$emit("submit");
        },
        handleCartUpdate() {
            console.log("Hello")
        }
    },
    computed: {

    },
    mounted() {
        this.retriveProductId();
    }
}
</script>

<style scoped></style>