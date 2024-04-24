<script>
import bookstoreService from '../services/bookstore.service';
import AddtoCart from './AddtoCart.vue';
import Swal from 'sweetalert2';

export default {
    components: {
        AddtoCart,

    },
    data() {
        return {
            getCountKey: 0,
            isOnSale: false,
            user: [],
            originalCost: 0,
            temp: 0,
            thisProduct: [],
            cart: null,
            selectedProducts: [],
            sortBy: null,
            id:'',
        }
    },

    props: {
        products: { type: Array, defualt: [] },
        activeIndex: { type: Number, default: -1 },
        userId: { type: String, require: true },
        KeyCount: { type: Number, require: true },
        getCheck: { type: Boolean, default: false },

    },
    watch: {
        getCountKey: 'updateKeyCount',
        selectedProducts(newValue) {
            // Gửi sự kiện về ParentComponent khi có sự thay đổi trong selectedProducts
            this.$emit('product-id-selected', newValue);
        },
    },
    emits: ["update:activeIndex", "update:modelValue", 'delete-selected-products'],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },
        updateKeyCount() {
            this.$emit("update:modelValue", this.getCountKey);
        },
        async check() {
            this.user = await bookstoreService.get(this.userId);
        },

        async getProductSale(productID) {
            this.thisProduct = await bookstoreService.getProduct(productID);
            if (this.temp == 0) {
                this.temp = 1;
            }
        },
        async submit() {
            if (this.thisProduct.onsale == true) {
                let priceTemp = this.thisProduct.price * 100 / (100 - this.thisProduct.salerate);
                this.thisProduct.salerate = this.$refs.inputRef.value;
                this.thisProduct.price = priceTemp - priceTemp * this.thisProduct.salerate / 100;
            } else {
                this.thisProduct.onsale = true;
                this.thisProduct.salerate = this.$refs.inputRef.value;
                if(this.thisProduct.salerate == 0) {
                    Swal.fire({
                        title: "Lỗi !",
                        text: "Tỉ lệ giảm giá phải có giá trị",
                        icon: "warning",
                        showConfirmButton: true,
                    });
                    return;
                }
                this.thisProduct.price = this.thisProduct.price - this.thisProduct.price * this.thisProduct.salerate / 100;
            }
            try {
                this.cart = this.thisProduct;
                // await bookstoreService.reUpdateCart(this.thisProduct._id, this.cart);
                await bookstoreService.update(this.thisProduct._id, this.thisProduct);
            } catch (error) {
            }
            
            Swal.fire({
                title: "Xác nhận giảm giá",
                text: "Bạn có muốn giảm giá sản phẩm này?",
                icon: "info",
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$emit('refresh-list');
                }
            });
        },
        async unSale() {
            const swalResult = await Swal.fire({
                title: "Hủy giảm giá",
                text: "Bạn có muốn hủy giảm giá của sản phẩm này?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Hủy giảm giá",
                cancelButtonText: "Hủy",
            });
            if (swalResult.isConfirmed) {
                this.thisProduct.onsale = false;
                this.thisProduct.price = this.thisProduct.price * 100 / (100 - this.thisProduct.salerate);
                this.thisProduct.salerate = 0;
                try {
                    await bookstoreService.reUpdateCart(this.thisProduct._id, this.thisProduct);
                } catch (error) {
                }
                await bookstoreService.update(this.thisProduct._id, this.thisProduct);
                this.$emit('refresh-list');
            }
        },
        getTemp() {
            if (this.temp == 0) {
                this.temp = 1;
            } else {
                this.temp = 0;
            }
        },
        deleteSelectedProducts() {
            // Gửi danh sách selectedProducts về ParentComponent
            this.$emit('delete-selected-products', this.selectedProducts);
            // Đặt lại danh sách selectedProducts
            this.selectedProducts = [];
        },
        sortProducts(value) {
            if (value === 'increase') {
                this.products.sort((a, b) => a.price - b.price);
            } else if (value === 'decrease') {
                this.products.sort((a, b) => b.price - a.price);
            }
        },

        formatNumber(number) {
            return number.toLocaleString();
        },
    },
    computed: {
        getForm() {
            return this.temp;
        },
        saleCost() {
            const cost = this.products.map(product => product.price);
            return cost;
        },

        originalCost() {
            return productId => {
                const product = this.products.find(p => p._id === productId);
                const cost = product.onsale ? product.price * 100 / (100 - product.salerate) : product.price;
                return this.formatNumber(cost);
            };
        },
        
    },
    created() {
        this.sortProducts();
    },
    mounted() {
        this.check();
    },
}
</script>

<template>
    <ul class="list-groups">
        <li class="list-group-items" v-for="(product, index) in products" :key="product._id"
            :class="{ active: index === activeIndex }">
            <div class="item-img">
                <img :src="product.img" alt="">
            </div>
            <div class="form-checks" v-if="this.getCheck">
                <input name="deleteProduct" type="checkbox" class="form-check-inputs" :value="product._id"
                    v-model="selectedProducts">
            </div>
            <div class="item-name">
                <strong>{{ product.name }} </strong>
            </div>
            <div class="item-authors">
                Tác giả: {{ product.author }}
            </div>
            <span class="view-detail" @click="updateActiveIndex(index)" data-bs-toggle="modal" data-bs-target="#myModal3">
                Xem chi tiết</span>
            <div class="price">
                <div :class="{ 'item-price': !product.onsale, 'non-item-price': product.onsale }">
                    Giá: {{ originalCost(product._id) }} VNĐ
                </div>
                <div :class="{ 'item-price-sale': product.onsale, 'non-item-price-sale': !product.onsale }">
                    Giá: {{ saleCost[index] }} VNĐ
                </div>
            </div>
            <div v-if="!this.user.admin">
                <AddtoCart :userId="this.userId" :productId="product._id" v-model="getCountKey"></AddtoCart>
            </div>
            <button v-if="this.user.admin" class="on-sale" @click="getProductSale(product._id)" data-bs-toggle="modal"
                data-bs-target="#myModalonTopProduct">Sale</button>
            <button v-if="product.onsale" class="sale">-{{ product.salerate }}%</button>
        </li>
    </ul>

    <div class="modal fade" id="myModalonTopProduct">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">

                <div class="modal-header">
                    <h4 class="modal-title">Thêm sách mới </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <!-- Modal body -->
                <div class="modal-body input-class">
                    <input type="number" ref="inputRef" class="input-field" :value="thisProduct.salerate"> <span
                        class="rate">%</span>
                    <div class="sale-button">
                        <div class="btn btn-warning" @click="submit"> Giảm giá</div>
                    </div>
                    <div class="unsale-button">
                        <button class="btn btn-danger" @click="unSale">Xóa giảm giá</button>
                    </div>
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                </div>

            </div>
        </div>
    </div>
</template>
<style scoped>
.list-groups {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    z-index: 1;
}

/* .list-group-item:hover{
        background-color: rgb(74, 139, 139);
    } */
.list-group-items img {
    position: relative;
    width: 120px;
    height: 170px;
    margin-bottom: 15px;
}

.list-group-items {
    position: relative;
    border: 1px outset;
    margin: 20px 25px;
    width: 250px;
    height: 450px;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-image: url('../assets/images/border-bg1.jpg');
    background-size: 100% 100%;
}

.sale {
    position: absolute;
    top: -2%;
    right: -10%;
    border: 2px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    /* xóa vùng trống */
}

.view-detail {
    font-size: 15px;
    cursor: pointer;
    margin-bottom: 2px;
}

.on-sale {
    max-height: 70px;
    max-width: 70px;
    width: 100%;
    font-size: 10px;
    border-radius: 5px;
    text-align: center;
    padding: 0;
    margin-top: 5px;
    height: 40px;
}

.rate {
    font-size: 20px;
}

.sale-groups {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    max-width: 600px;
    padding: 20px;
    background-color: #e2dede;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.sale-groups input {
    max-width: 100px;
    margin-bottom: 5px;
    border-radius: 10px;
}

.non-item-price {
    opacity: 0.5;
    text-decoration: line-through;
}

.item-name {
    text-align: center;
    max-width: 200px;
    margin-bottom: 10px;
    white-space: nowrap;
    /* Ngăn chặn ngắn dòng khi nội dung vượt quá */
    overflow: hidden;
    /* Ẩn nội dung dư thừa */
    text-overflow: ellipsis;
}
</style>