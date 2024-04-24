<template>
    <ul class="history-list">
        <li class="history-item" v-for="(product, index) in sortedOrderBill" :key="product._id">
            <div class="history-heading">
                <div class="heading-img">
                    <strong>Sản phẩm</strong>
                </div>
                <div class="heading-name">
                    <strong>Tên sản phẩm</strong>
                </div>
                <div class="heading-count">
                    <strong>Số lượng</strong>
                </div>
                <div class="heading-price">
                    <strong>Giá</strong>
                </div>
            </div>
            <div class="history-body">
                <ul class="history-body-list ps-0">
                    <li v-for="(item) in product.items" class="history-body-items">
                        <div class="history-body-img">
                            <img :src="item.img" alt="">
                        </div>
                        <div class="history-body-name">
                           <strong> {{ item.name }}</strong>
                        </div>
                        <div class="history-body-count">
                            <strong>{{ item.count }}</strong>
                        </div>
                        <div class="history-body-price">
                            <strong>{{ cost(item.price) }}đ</strong>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="history-footer-date">
                <strong>
                    Ngày đặt hàng: {{ product.ngaythem }}
                </strong>
            </div>
            <div class="history-footer-cost">
                <strong>Tổng tiền: {{ cost(product.tongtien) }}đ</strong>
            </div>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        orderBill: { type: Object, default: [] },
    },
    computed: {
        sortedOrderBill() {
            return this.orderBill.slice().reverse();
        },
        cost() {
            return invoiceCost => {
                return this.formatNumber(invoiceCost);
            }
        },
    },
    methods: {
        check() {
            console.log("hello");
            console.log(this.orderBill);
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
<style scoped>
.history-list {
    list-style: none;
}
.history-item {
    margin-bottom: 30px;
    position: relative;
    list-style: none;
    border: 2px solid rgb(142, 142, 249);
    border-radius: 5px;
}

.history-heading{
    display: flex;
    text-align: center;
    height: 40px;
    border-bottom: 2px solid rgb(142, 142, 249);
}
.heading-img{
    width: 220px;
    border-right:2px solid rgb(142, 142, 249) ;
}
.heading-name{
    width: 220px;
    border-right:2px solid rgb(142, 142, 249) ;
}
.heading-count{
    width: 100px;
    border-right:2px solid rgb(142, 142, 249) ;
}
.heading-price{
    width: 190px;
}
.history-body-list{
    list-style: none;
    & li{
        display: flex;
        height: 200px;
        border-bottom: 2px solid rgb(142, 142, 249) ;
    }
}
.history-body-img{
    height: 200px;
    width: 215px;
    border-right:2px solid rgb(142, 142, 249);
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    & img{
        width: 60%;
        height: 80%;
    }
}
.history-body-name{
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 215px;
    border-right:2px solid rgb(142, 142, 249);
}
.history-body-count{
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 99px;
    border-right:2px solid rgb(142, 142, 249);
}
.history-body-price{
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 185px;
}
.history-footer-date{
    height: 30px;
    border-bottom: 2px solid rgb(142, 142, 249);
}
</style>