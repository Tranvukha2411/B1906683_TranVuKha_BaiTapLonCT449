<template>
    <ul class="cart-list">
       <div class="title">
        <h2 >SÁCH ĐANG VẬN CHUYỂN</h2>
       </div>
        <li class="cart-list-item" v-for="(product, index) in products" :key="product._id"
            :class="{ active: index === activeIndex }">
            <div class="items">
                <div class="img-item">
                    <img :src="product.img" alt="">
                </div>
                <div class="detail">
                    <div class="item-detail">
                        <strong>Tên:</strong> {{ product.name }}
                    </div>
                    <div class="item-detail">
                        {{ product.type }}
                    </div>
                    <div class="item-detail">
                        <strong>Tác giả:</strong> {{ product.author }}
                    </div>
                    <div class="item-detail">
                        <strong>Giá:</strong> {{ product.price }}
                    </div>
                    <div class="item-detail">
                        <strong>Số lượng:</strong> {{ product.count }}
                    </div>
                    <div class="item-detail">
                        <strong>Tổng:</strong> {{ product.price * product.count }}
                    </div>
                    <div class="item-detail">
                        <strong>Ngày thanh toán: {{ product.ngaythem }}</strong>
                    </div>
                    
                </div>
                <div class="describe-item">
                    <strong>Mô tả:</strong> {{ product.describe }}
                </div>
            </div>
        </li>
        <div class="emptys" v-if="products.length == 0">
        <strong>TRỐNG</strong>
    </div>
    </ul>
    
</template>

<script>
    import bookstoreService from '../services/bookstore.service';
    export default {
        props: {
            products: { type: Object, default: [] },
            activeIndex: { type: Number, default: -1 },
        },
    }
</script>

<style>
    .items {
    margin: 20px;
    display: flex;
    flex-direction: row;
}

.cart-list{
    position: relative;
}

.cart-list-item img {
    width: 120px;
    height: 150px;
}

.cart-list-item {
    margin-top: 15px;
    position: relative;
    list-style: none;
    border: 2px solid rgb(142, 142, 249);
    border-radius: 5px;
}

.detail {
    margin-left: 20px;
    max-width: 400px;
    width: 250px;
}

.emptys {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgb(181, 178, 178);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    max-height: 200px;
    height: 200px;
    font-size: 100px;
    opacity: 0.3;
    position: relative;
}

.title {
    position: relative;
    margin-top: 5px;
    padding: 10px 0;
    border: 1px solid;
    border-radius: 50px;
}
</style>