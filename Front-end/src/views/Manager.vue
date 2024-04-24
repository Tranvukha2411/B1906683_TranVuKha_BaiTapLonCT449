<template>    
        <div class="manager-body">
            <div class="manager-body-header">
                <h2>TRANG QUẢN LÝ KHÁCH HÀNG</h2>
                <div class="navation">
                    <div class="invoice-manager">
                    <router-link :to="{
                        name: 'invoice',
                    }" class="invoice">
                    Quản lý hóa đơn</router-link> |
                </div>
                <div class="product-manager">
                    <router-link :to=" {
                        name: 'productManager',
                        query: {userID: this.userID}
                    }" class="product-manager-link">Quản lý sản phẩm</router-link>
                </div> 
            </div>
            </div>
            <div class="main-contents">
            <div class="left-content">
                <h4>Danh sách người dùng</h4>
                <div class="user-list">  
                    <UserList :users="filteredUser" v-model:activeIndex="activeIndex"></UserList>
                </div>
            </div>
            <div class="right-content">
                <h4>Thông tin chi tiết</h4>
                <div class="user-info">
                    <UserInfo :user="activeUser"  v-if="activeUser"></UserInfo>
                </div>
            </div>
        </div>
        </div>
    
</template>

<script>
    import bookstoreService from '../services/bookstore.service';
    import UserList from '../components/UserList.vue';
    import UserInfo from '../components/UserInfo.vue'
    export default {
        components: {
            UserList,
            UserInfo,
        },
        props: {
            userID: {type: String},
        },
        data() {
            return {
                users: [],
                activeIndex:-1,
            }
        },
        computed: {
            filteredUser() {
                return this.users;
            },

            activeUser() {
                if(this.activeIndex < 0) return null;
                return this.filteredUser[this.activeIndex];
            }
        },
        methods: {
            async retriveUserList() {
                try{
                    this.users = await bookstoreService.getAll();
                    
                }catch(error) {
                    console.log(error);
                }
            },

            refreshList() {
                this.retriveUserList();
            },
        },
        mounted() {
            this.refreshList();
        },
    }
</script>