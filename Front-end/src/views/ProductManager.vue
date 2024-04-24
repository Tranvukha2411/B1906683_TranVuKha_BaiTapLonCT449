<template>
    <div class="manager-body">
        <div class="manager-body-header">
            <h2>Trang quản lý sản phẩm</h2>
            <div class="sort-icon">
                <i class="fa-solid fa-arrow-down-a-z" @click="sortItem('increase')" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Sắp xếp từ a-z"></i>
                <i class="fa-solid fa-arrow-up-a-z" @click="sortItem('decrease')" data-bs-toggle="tooltip"
                    data-bs-placement="top" title="Sắp xếp từ z-a"></i>
            </div>

        </div>
        <div class="main-contents">
            <div class="left-content">
                <div class="left-content-header">
                    <h4>Danh sách sản phẩm</h4>
                </div>
                <div class="product-manager-list">
                    <ManagerProduct ref="productList" :products="filteredProduct" v-model:activeIndex="activeIndex"
                        @product-id-selected="handleProductIdSelected" :getCheck="getCheck"></ManagerProduct>
                </div>
                <div class="delete-product">
                    <div class="delete-icon" @click="changeGetCheck" data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Xóa sách">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                    <div class="delete-product-button" v-if="getCheck">
                        <button @click="deleteSelectedProducts" class="btn btn-custom">Xóa</button>
                    </div>
                </div>
            </div>

            <div class="right-content">
                <h4>Chi tiết sản phẩm</h4> 
                <div class="product-info">
                    <Detail :productDetail="activeProduct" :id="userID" v-if="activeProduct"></Detail>
                    <div class="edit" v-if="activeProduct">
                        <i class="fa-solid fa-pen-to-square" @click="doEdit" data-bs-toggle="modal"
                            data-bs-target="#myModal3"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="manager-footer">
            
        </div>
    </div>
</template>
<script>
import bookstoreService from '../services/bookstore.service';
import ManagerProduct from '../components/ManagerProduct.vue';
import Detail from '../components/Detail.vue';
import Swal from 'sweetalert2';
import { Tooltip } from 'bootstrap';
export default {
    components: {
        ManagerProduct,
        Detail,
    },
    props: {
        userID: { type: String },
    },
    data() {
        return {
            products: [],
            activeIndex: -1,
            productId: '',
            productSelected: [],
            getCheck: false,
        }
    },
    computed: {
        filteredProduct() {
            return this.products;
        },

        activeProduct() {
            if (this.activeIndex < 0) return null;
            return this.filteredProduct[this.activeIndex];
        }
    },
    methods: {
        async retriveProducts() {
            this.products = await bookstoreService.getAllProduct();
        },

        doEdit() {
            this.$router.push({
                name: 'editor',
                params: { productId: this.products[this.activeIndex]._id },
            })
        },
        handleProductIdSelected(selectedProducts) {
            this.productSelected = selectedProducts;
        },
        async deleteSelectedProducts() {
            if (this.productSelected.length == 0) {
                Swal.fire({
                    title: "Không có sản phẩm nào được chọn để xóa",
                    icon: "info"
                });
                return;
            }
            try {
                const swalResult = await Swal.fire({
                    title: "Bán có muốn xóa " + this.productSelected.length + " sản phẩm?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Có",
                    cancelButtonText: "Hủy",
                });
                if (swalResult.isConfirmed) {
                    await Promise.all(this.productSelected.map(async (id) => {
                        await bookstoreService.deleteProduct(id);
                        await bookstoreService.deleteCartbyProductId(id);
                    }));
                    location.reload();
                }
            } catch (error) {
                console.log(error);
            }
        },
        changeGetCheck() {
            if(this.getCheck) this.getCheck = false;
            else this.getCheck = true;
        },
        sortItem(value) {
            this.activeIndex = -1;
            this.$refs.productList.sortProducts(value);
        }
    },
    mounted() {
        this.retriveProducts();
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        });
    }
}
</script>

<style scoped>
.edit {
    position: absolute;
    bottom: 45%;
}
.left-content{
    max-height: 350px;
}
/* .btn-delete{
    border-radius: 10px;
    height: 40px;
    width: 30px;
    text-align: center;
    align-items: center;
    justify-content: center;
} */
.btn-custom{
    background-color: rgb(96, 28, 28);
    color: aliceblue;
    font-weight: bold;
    width: 60px;
    text-align: center;
    
}
.delete-product{
    display: flex;
    position: relative;
    left: 120px;
    top: 20px;
}

.delete-icon{
    margin-right: 10px;
    font-size: 20px;
    color: rgb(96, 28, 28);
    cursor: pointer;
}
.sort-icon{
    position: absolute;
    left: 30%;
    top: 130px;
    z-index: 2;
    & i{
        font-size: 25px;
        margin-right: 15px;
        border: 1px solid;
        cursor: pointer;
    }
}
</style>