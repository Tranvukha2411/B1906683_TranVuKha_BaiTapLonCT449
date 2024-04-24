<template>
    <div class="editor-body">
        <h2>Cập nhật thông tin</h2>
        <AddProductForm :products="product" @submit:products="updateProduct"></AddProductForm>
    </div>
</template>
<script>
import bookstoreService from '../services/bookstore.service';
import AddProductForm from '../components/AddProductForm.vue';
import Swal from 'sweetalert2';


export default {
    props: {
        productId: { type: String, required: true },
        userId: { type: String, required: true },
    },
    components: {
        AddProductForm,

    },
    data() {
        return {
            product: null,
            cart: null,
            check: false,
        }
    },
    methods: {
        async retriveProduct(productId) {
            try {
                this.product = await bookstoreService.getProduct(productId);
                try {
                    this.cart = await bookstoreService.getOneCartByPro(productId);
                    console.log(this.cart);
                    this.check = true;
                } catch (error) {

                }
            } catch (error) {
                console.log(error);
            }
        },
        async updateProduct() {
            try {
                const swalResult = await Swal.fire({
                    title: "Cập nhật thông tin sản phẩm",
                    text: "Bạn có muốn cập nhật thông tin của sản phẩm này không?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Cập nhật",
                    cancelButtonText: "Hủy",
                });
                if (swalResult.isConfirmed) {
                    if (this.check == true) {
                        this.cart = this.product;
                        await bookstoreService.reUpdateCart(this.productId, this.cart);
                    }
                    await bookstoreService.update(this.productId, this.product);
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.retriveProduct(this.productId);
    },
    mounted() {

    }
}
</script>
<style>
.editor-body {
    max-width: 500px;
    border: 2px solid;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 700px;
}
</style>