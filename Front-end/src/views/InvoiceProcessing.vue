<template>
    <div class="app-header">

    </div>
    <div class="invoice-body">
        <div class="app-body-leftside">
            <div class="left-side">
                <Invoice :orderBill="order" v-model:userID="userID" v-model:productId="productId" @invoice-id-selected="handleSelected" :getCheck="getCheck"></Invoice>
            </div>
            <div class="right-side">
                <div class="right-side-info">
                    <UserInfo :user="user" v-if="user"></UserInfo>
                    
                    <div class="modal fade" id="detailModal">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Thông tin sách </h4>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <Detail :productDetail="product" v-if="product"></Detail>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="invoice-footer">
        <button class="btn btn-primary" @click="checkSelected">Xóa</button>
        <button class="btn btn-primary" v-if="getCheck" @click="deleteSelectedProducts"> Xóa các đơn hàng được chọn</button>
    </div>
</template>
<script>
import bookstoreService from '../services/bookstore.service';
import Invoice from '../components/Invoice.vue';
import UserInfo from '../components/UserInfo.vue';
import Detail from '../components/Detail.vue';
import Swal from 'sweetalert2';
export default {
    components: {
        Invoice,
        UserInfo,
        Detail,

    },
    data() {
        return {
            order: [],
            userID: null,
            user: '',
            productId: null,
            product: '',
            invoicesSelected:[],
            getCheck: false,
        }
    },
    watch: {
        userID: 'getUser',
        productId: 'getProduct',
    },

    methods: {
        async retriveInvoice() {
            this.order = await bookstoreService.getAllInvoice();
        },
        async getUser() {
            this.user = await bookstoreService.get(this.userID);
        },
        async getProduct() {
            this.product = await bookstoreService.getProduct(this.productId);
        },
        handleSelected(selectedInvoice) {
            this.invoicesSelected = selectedInvoice;
        },
        checkSelected() {
            if(this.getCheck) {
                this.getCheck = false;
            } else{
                this.getCheck = true;
            }
        },
        async deleteSelectedProducts() {
            if (this.invoicesSelected.length == 0) {
                Swal.fire({
                    title: "Không có sản phẩm nào được chọn để xóa",
                    icon: "info"
                });
                return;
            }
            try {
                const swalResult = await Swal.fire({
                    title: "Bán có muốn xóa " + this.invoicesSelected.length + " sản phẩm?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Có",
                    cancelButtonText: "Hủy",
                });
                if (swalResult.isConfirmed) {
                    await Promise.all(this.invoicesSelected.map(async (id) => {
                        await bookstoreService.deleteInvoices(id);
                    }));
                    this.retriveInvoice();
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.retriveInvoice();
    }
}
</script>