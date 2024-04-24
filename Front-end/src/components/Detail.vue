<script>
import bookstoreService from '../services/bookstore.service';
import Report from './Report.vue';
export default {
    components: {
        Report,
    },
    props: {
        productDetail: { type: Object },
        userID: { type: String },
        isComment: {type: Boolean},
    },
    data() {
        return {
            isAdmin: false,
            user: [],
        }
    },
    computed: {
        formatedCost() {
            return this.formatNumber(this.productDetail.price);
        }
    },
    methods: {
        async check() {
            this.user = await bookstoreService.get(this.userID);
            console.log(this.user);
            this.isAdmin = this.user.admin;
        },
        formatNumber(number) {
            return number.toLocaleString();
        },
    },
    mounted() {
        this.check();
    }
}
</script>

<template>
    <div class="detail-products">
        <div class="productDetail-img">
            <img :src="this.productDetail.img" alt="">
        </div>
        <div class="productDetail-detail">
            <div class="p-1">
                <strong>Tên:</strong>
                {{ this.productDetail.name }}
            </div>
            <div class="p-1">
                <strong>Tác giả:</strong>
                {{ this.productDetail.author }}
            </div>
            <div class="p-1">
                <strong>Giá:</strong>
                {{ formatedCost }} VNĐ
            </div>
            <div class="p-1 content">
                <strong>Mô tả: </strong>
                {{ this.productDetail.describe }}
            </div>
        </div>
    </div>
    <div class="comment-box" v-if="isComment">
        <Report :productId="productDetail._id" :userId="userID"></Report>
    </div>
</template>
<style>
.detail-products {
    display: flex;
    flex-direction: row;
    max-width: 600px;
}

.productDetail-img {
    width: 130px;
    height: 170px;
}

.productDetail-img img {
    width: 100%;
    height: 100%;
}

.productDetail-detail {
    margin-left: 10px;
    width: 400px;
}
.comment-box{
    margin-top: 40px;
}
.content{
    text-align: justify;
}
/* .editor {
    position: absolute;
    top: 90%;
    right: 10%;
} */
</style>