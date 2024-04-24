<template>
    <button v-if="this.user.admin" class="on-sale" @click="getProduct">Sale</button>
</template>

<script>
    import bookstoreService from '../services/bookstore.service';
    export default {
        props: {
            productID: {type: String},
        },
        methods: {
            getProduct() {
                console.log(this.productID);
            }
        }
    }
</script>