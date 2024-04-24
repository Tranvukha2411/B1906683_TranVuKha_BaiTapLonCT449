<template>
    <div class="input-comment">
        <textarea name="comment" id="comment" cols="60" rows="6" placeholder="Bình luận..."
            v-model="this.comment"></textarea>
        <button class="btn btn-primary" @click="commentType">Gửi</button>
    </div>
    <div class="output-comment">
        <h4>Bình luận</h4>
        <ul class="comment-list" >
            <li class="comment-item" v-for="(comment, index) in reportList" :key="comment._id">
                <div class="ouput-comment-body">
                    <div class="user-info2">
                        <img src="../assets/images/avatar-13-vector-42526238.jpg" alt="" v-if="comment.anonymous">
                        <img :src="comment.userAvatar" alt="" class="rounded-circle" v-if="!comment.anonymous">
                        <strong v-if="!comment.anonymous">{{comment.username }}</strong>
                        <strong v-if="comment.anonymous">Ẩn danh</strong>
                        <strong class="ngay-dang">{{ comment.ngaydang }}</strong>
                    </div>
                    <div class="comment">
                        {{ comment.content }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import bookstoreService from '../services/bookstore.service';
import Swal from 'sweetalert2';

export default {
    props: {
        productId: { type: String },
        userId: { type: String },
    },
    watch:{
        productId: 'retriveReport',
    },
    data() {
        return {
            reports: [],
            comment: '',
            newPost: {
                userID: '',
                productId: '',
                content: '',
                star: '',
                ngaydang: '',
                username:'',
                userAvatar:null,
            },
            user:'',
            anonymous: false,
        }
    },
    computed: {
        reportList() {
            return this.reports.slice().reverse();
        }

    },
    methods: {
        async retriveReport() {
            this.reports = await bookstoreService.getReport(this.productId);
            this.user = await bookstoreService.get(this.userId);
        },
        commentType() {
            Swal.fire({
                title: "Chọn cách hiển thị bình luận",
                showDenyButton: true,
                confirmButtonText: "Ẩn danh",
                denyButtonText: `Công khai`,
                }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.newPost.anonymous = true;
                    this.postComment();
                } else if (result.isDenied) {
                    this.newPost.anonymous = false;
                    this.postComment();
                }
                });
        },
        async postComment() {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            this.newPost.userID = this.userId;
            this.newPost.username = this.user.name;
            this.newPost.userAvatar = this.user.avatar;
            this.newPost.productId = this.productId;
            this.newPost.content = this.comment;
            this.newPost.ngaydang = formattedDate;
            await bookstoreService.postComment(this.newPost);
            this.comment = '',
            this.retriveReport();
        }
    },
    mounted() {
        this.retriveReport();
    }
}
</script>

<style scoped>
.comment-list{
    list-style: none;
}
.comment-item{
    margin-bottom: 20px;
    border: 1px solid rgba(128, 128, 128, 0.673);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 10px 10px 5px lightblue;
}
.ouput-comment-body {
    display: grid;
    grid-template-rows: 1fr 1fr;
}

.ngay-dang{
    position: absolute;
    left: 50%;
}
.user-info2 {

    & img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }
}
.comment{
    width: 400px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
    left: 10%;

}
</style>