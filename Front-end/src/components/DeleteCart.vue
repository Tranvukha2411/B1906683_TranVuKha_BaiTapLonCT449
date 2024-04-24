<template>
    <div class="input-groups">
        <input type="number" ref="inputRef" class="input-field">
        <div class="deleteButton">
            <div class="btn btn-danger" @click="submit"> Xóa</div>
        </div>
    </div>
</template>

<script>
import bookstoreService from '../services/bookstore.service';
import Swal from 'sweetalert2';

export default {
    props: {
        productID: { type: String },
    },
    methods: {
        async submit() {
            this.product = await bookstoreService.getCart(this.productID);
            let originalCost = this.product.cost / this.product.count;
            if (this.$refs.inputRef.value > this.product.count) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Số lượng bạn muốn xóa đã vượt qua số lượng hiện tại trong giỏ hàng",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            } else {
                Swal.fire({
                    title: "Xóa sản phẩm",
                    text: "Bạn muốn xóa " + this.$refs.inputRef.value + " sản phẩm ra khỏi giỏ hàng?",
                    icon: "question",
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.product.count -= this.$refs.inputRef.value;
                        this.product.cost = originalCost * this.product.count;
                        if (this.product.count == 0) {
                            bookstoreService.deleteCart(this.productID);
                            location.reload();
                        }
                            console.log(originalCost);
                            bookstoreService.deleteCartCount(this.productID, this.product);
                            location.reload();
                    }
                });
            }

        }
    },
    data() {
        return {
            product: [],
        }
    },

}
</script>

<style>
.input-field {
    max-width: 70px;
    max-height: 35px;
    border-radius: 5px;
}

/* .input-groups {
    position: fixed;
    left: 60%;
    bottom: 50%;
    max-width: 300px;
    max-height: 400px;
    border: 1px solid;
    width: 300px;
    height: 400px;
    transform: translate(-50%, 50%)
} */

    .input-groups{
        display: flex;
        flex-direction: row;
    }
    .btn {
        margin-left: 5px;
    }
</style>