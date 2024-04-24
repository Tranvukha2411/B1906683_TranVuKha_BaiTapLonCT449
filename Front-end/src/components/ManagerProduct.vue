<template>
    <ul class="list-groups">
        <li class="list-group-items" v-for="(product, index) in products" :key="product._id"
            :class="{ active: index === activeIndex }">
            <div class="name" @click="updateActiveIndex(index)">
                {{ product.name }}
            </div>
            <div class="form-check2" v-if="getCheck">
                <input name="deleteProduct" type="checkbox" class="form-check-input2" :value="product._id"
                    v-model="selectedProducts">
            </div>
        </li>
    </ul>
</template>
<script>
import bookstoreService from '../services/bookstore.service';

export default {
    props: {
        products: { type: Object, default: [] },
        activeIndex: { type: Number, default: -1 },
        getCheck: { type: Boolean, default: false },
    },
    data() {
        return {
            selectedProducts: [],
            sortBy: null,
        }
    },
    watch: {
        selectedProducts(newValue) {
            // Gửi sự kiện về ParentComponent khi có sự thay đổi trong selectedProducts
            this.$emit('product-id-selected', newValue);
        },
    },
    emits: ['update:activeIndex'],
    methods: {
        updateActiveIndex(index) {
            this.$emit('update:activeIndex', index);
        },
        deleteSelectedProducts() {
            // Gửi danh sách selectedProducts về ParentComponent
            this.$emit('delete-selected-products', this.selectedProducts);
            // Đặt lại danh sách selectedProducts
            this.selectedProducts = [];
        },
        sortProducts(value) {
            if (value === 'increase') {
                this.products.sort((a, b) => a.name.localeCompare(b.name));
            } else if (value === 'decrease') {
                this.products.sort((a, b) => b.name.localeCompare(a.name));
            }
        },
    },
    created() {
        this.sortProducts();
    },
    
}
</script>

<style scoped>
.list-groups {
    padding: 0;
    margin: 0;
}

.list-group-items {
    list-style: none;
    border-bottom: 3px solid rgb(91, 47, 5);
    cursor: pointer;
    font-weight: bold;
    display: flex;
    flex-direction: column;
}

.list-group-items:hover {
    background-color: rgba(132, 211, 211, 0.471);
}

.active {
    background-color: rgba(132, 211, 211, 0.471);
}

.form-check2 {
    position: absolute;
    right: 0;
}

.form-check-input2 {
    width: 15px;
    height: 15px
}</style>